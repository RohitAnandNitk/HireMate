from datetime import datetime
from enum import Enum

class DriveStatus(str, Enum):
    RESUME_UPLOADED = "resumeUploaded"
    RESUME_SHORTLISTED = "resumeShortlisted"
    EMAIL_SENT = "emailSent"
    INTERVIEW_SCHEDULED = "InterviewScheduled"
    SELECTION_EMAIL_SENT = "selectionEmailSent"


def create_drive(company_id, role, location, start_date, end_date, rounds=None, job_id=None, status=None):
    """
    Create a drive (job posting) document.
    """
    if rounds is None:
        rounds = [{"type": "Technical", "description": ""}]

    # if status is None → default, else validate
    status = status or DriveStatus.RESUME_UPLOADED
    if status not in DriveStatus._value2member_map_:
        raise ValueError(f"Invalid status '{status}'. Must be one of: {list(DriveStatus._value2member_map_.keys())}")

    return {
        "job_id": job_id,
        "company_id": company_id,
        "role": role,
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "rounds": rounds,
        "status": status,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
