from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime
from datetime import datetime

from database import Base


# ==========================================
# USER TABLE
# ==========================================

class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="user"
    )


# ==========================================
# LOCATION TABLE
# ==========================================

class Location(Base):

    __tablename__ = "locations"

    location_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    latitude = Column(
        Float
    )

    longitude = Column(
        Float
    )

    address = Column(
        String(255)
    )


# ==========================================
# STATUS TABLE
# ==========================================

class Status(Base):

    __tablename__ = "statuses"

    status_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    status_name = Column(
        String(50),
        nullable=False
    )


# ==========================================
# COMPLAINT TABLE
# ==========================================

class Complaint(Base):

    __tablename__ = "complaints"

    complaint_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id")
    )

    location_id = Column(
        Integer,
        ForeignKey("locations.location_id")
    )

    status_id = Column(
        Integer,
        ForeignKey("statuses.status_id")
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    created_date = Column(
        DateTime,
        default=datetime.utcnow
    )


# ==========================================
# IMAGE TABLE
# ==========================================

class Image(Base):

    __tablename__ = "images"

    image_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.complaint_id")
    )

    image_path = Column(
        String(255)
    )