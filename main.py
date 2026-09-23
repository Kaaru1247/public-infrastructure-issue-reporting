from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session

from passlib.context import CryptContext

from jose import jwt
from datetime import datetime, timedelta, timezone

import os
import shutil

import models
from database import engine, SessionLocal, Base


# =========================================================
# DATABASE
# =========================================================

# Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Public Infrastructure Issue Reporting API"
)


# =========================================================
# UPLOAD FOLDER
# =========================================================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# JWT SETTINGS
# =========================================================

SECRET_KEY = "public_infrastructure_secret_key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Public Infrastructure Issue Reporting API is running"
    }


# =========================================================
# GET USERS
# =========================================================

@app.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(
        models.User
    ).all()

    return users


# =========================================================
# REGISTER
# =========================================================

@app.post("/register")
def register(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    existing_user = db.query(
        models.User
    ).filter(
        models.User.email == email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        password
    )

    new_user = models.User(
        name=name,
        email=email,
        password=hashed_password,
        role="user"
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Registration successful",
        "user_id": new_user.user_id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }


# =========================================================
# VERIFY EMAIL
# =========================================================

@app.get("/verify-email")
def verify_email(
    email: str,
    db: Session = Depends(get_db)
):

    user = db.query(
        models.User
    ).filter(
        models.User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    return {
        "message": "Email verified",
        "user_id": user.user_id,
        "name": user.name,
        "role": user.role
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = db.query(
        models.User
    ).filter(
        models.User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.user_id),
        "role": user.role
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "name": user.name,
        "role": user.role
    }


# =========================================================
# CREATE LOCATION
# =========================================================

@app.post("/locations")
def create_location(
    latitude: float,
    longitude: float,
    address: str,
    db: Session = Depends(get_db)
):

    new_location = models.Location(
        latitude=latitude,
        longitude=longitude,
        address=address
    )

    db.add(new_location)

    db.commit()

    db.refresh(new_location)

    return {
        "message": "Location created successfully",
        "location_id": new_location.location_id,
        "latitude": new_location.latitude,
        "longitude": new_location.longitude,
        "address": new_location.address
    }


# =========================================================
# GET LOCATIONS
# =========================================================

@app.get("/locations")
def get_locations(
    db: Session = Depends(get_db)
):

    locations = db.query(
        models.Location
    ).all()

    return locations


# =========================================================
# CREATE COMPLAINT
# =========================================================

@app.post("/complaints")
def create_complaint(
    user_id: int,
    location_id: int,
    title: str,
    description: str,
    db: Session = Depends(get_db) 
):

    user = db.query(
        models.User
    ).filter(
        models.User.user_id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    location = db.query(
        models.Location
    ).filter(
        models.Location.location_id == location_id
    ).first()

    if not location:

        raise HTTPException(
            status_code=404,
            detail="Location not found"
        )

    status = db.query(
        models.Status
    ).filter(
        models.Status.status_name == "Reported"
    ).first()

    if not status:

        status = models.Status(
            status_name="Reported"
        )

        db.add(status)

        db.commit()

        db.refresh(status)

    new_complaint = models.Complaint(
        user_id=user_id,
        location_id=location_id,
        status_id=status.status_id,
        title=title,
        description=description
    )

    db.add(new_complaint)

    db.commit()

    db.refresh(new_complaint)

    return {
        "message": "Complaint submitted successfully",
        "complaint_id": new_complaint.complaint_id,
        "user_id": new_complaint.user_id,
        "location_id": new_complaint.location_id,
        "title": new_complaint.title,
        "description": new_complaint.description,
        "status": status.status_name
    }


# =========================================================
# GET ALL COMPLAINTS
# =========================================================

@app.get("/complaints")
def get_complaints(
    db: Session = Depends(get_db)
):

    complaints = db.query(
        models.Complaint
    ).all()

    result = []

    for complaint in complaints:

        status = db.query(
            models.Status
        ).filter(
            models.Status.status_id ==
            complaint.status_id
        ).first()

        result.append({
            "complaint_id": complaint.complaint_id,
            "user_id": complaint.user_id,
            "location_id": complaint.location_id,
            "title": complaint.title,
            "description": complaint.description,
            "status": (
                status.status_name
                if status
                else "Unknown"
            ),
            "created_date": complaint.created_date
        })

    return result


# =========================================================
# UPDATE COMPLAINT STATUS
# =========================================================

@app.put(
    "/complaints/{complaint_id}/status"
)
def update_complaint_status(
    complaint_id: int,
    status_name: str,
    db: Session = Depends(get_db)
):

    complaint = db.query(
        models.Complaint
    ).filter(
        models.Complaint.complaint_id ==
        complaint_id
    ).first()

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    status = db.query(
        models.Status
    ).filter(
        models.Status.status_name ==
        status_name
    ).first()

    if not status:

        status = models.Status(
            status_name=status_name
        )

        db.add(status)

        db.commit()

        db.refresh(status)

    complaint.status_id = status.status_id

    db.commit()

    db.refresh(complaint)

    return {
        "message": "Complaint status updated successfully",
        "complaint_id": complaint.complaint_id,
        "status": status.status_name
    }


# =========================================================
# UPLOAD IMAGE
# =========================================================

@app.post(
    "/complaints/{complaint_id}/images"
)
def upload_image(
    complaint_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    complaint = db.query(
        models.Complaint
    ).filter(
        models.Complaint.complaint_id ==
        complaint_id
    ).first()

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    upload_folder = "uploads"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    new_image = models.Image(
        complaint_id=complaint_id,
        image_path=file_path
    )

    db.add(new_image)

    db.commit()

    db.refresh(new_image)

    return {
        "message": "Image uploaded successfully",
        "image_id": new_image.image_id,
        "complaint_id": complaint_id,
        "image_path": file_path
    }


# =========================================================
# GET COMPLAINT IMAGES
# =========================================================

@app.get(
    "/complaints/{complaint_id}/images"
)
def get_complaint_images(
    complaint_id: int,
    db: Session = Depends(get_db)
):

    images = db.query(
        models.Image
    ).filter(
        models.Image.complaint_id ==
        complaint_id
    ).all()

    return [
        {
            "image_id": image.image_id,
            "complaint_id": image.complaint_id,
            "image_path": image.image_path
        }
        for image in images
    ]