1. Title
Smart Road Issue Reporting System
2. Domain
Smart City | Python | Civic Issue Management
3. Who is the User? (2–3 user types, with roles)
Citizen – Reports road issues and tracks complaint status.
Municipal Officer – Verifies complaints, updates status, and resolves issues.
Admin – Manages users, assigns complaints, and monitors the system.
4. What problem are we solving?
Many people notice potholes, broken streetlights, or damaged roads but do not know where or how to report them. As a result, these issues remain unresolved for a long time. This application provides an easy way for citizens to report problems online. For example, if a person finds a pothole on the way to work, they can upload the location and details, and the municipal officer can take action quickly.
5. Proposed Solution
User registration and login.
Report road issues with description and location.
Upload images of the issue.
Track complaint status (Pending, In Progress, Resolved).
Admin dashboard to manage users and complaints.
Municipal officer dashboard to verify and resolve complaints.
6. Core Entities / Database Tables (Minimum 5)
Users
Complaints
Locations
Complaint_Status
Images
Notifications
7. User Roles & Permissions
Admin
Manage users.
Assign complaints.
View reports.
Monitor the system.
Citizen
Register/Login.
Submit complaints.
Upload images.
Track complaint status.
Municipal Officer
View assigned complaints.
Update complaint status.
Mark issues as resolved.
8. Success Criteria
A citizen should be able to submit a complaint in under 2 minutes.
Officers should be able to update complaint status easily.
Users should be able to track complaint progress at any time.
Admin should be able to manage complaints and users successfully.
9. Out of Scope
Live GPS tracking.
AI-based road damage detection.
Online payment integration.
SMS/Voice call notifications.
Integration with government systems.
10. Chosen Track
Python (FastAPI)