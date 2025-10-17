from datetime import datetime
from enum import Enum

class DriveStatus(str, Enum):
    RESUME_UPLOADED = "resumeUploaded"
    RESUME_SHORTLISTED = "resumeShortlisted"
    EMAIL_SENT = "emailSent"
    INTERVIEW_SCHEDULED = "InterviewScheduled"
    SELECTION_EMAIL_SENT = "selectionEmailSent"

class JobType(str, Enum):
    FULL_TIME = "full-time"
    INTERNSHIP = "internship"


def create_drive(
    company_id, 
    role, 
    location, 
    start_date, 
    end_date, 
    candidates_to_hire,
    job_type=JobType.FULL_TIME,
    skills=None, 
    rounds=None, 
    job_id=None, 
    status=None,
    internship_duration=None,
    coding_question_ids=None
):
    """
    Create a drive (job posting) document.
    """
    if rounds is None:
        rounds = [{"type": "Technical", "description": ""}]

    # Validate status
    status = status or DriveStatus.RESUME_UPLOADED
    if status not in DriveStatus._value2member_map_:
        raise ValueError(f"Invalid status '{status}'. Must be one of: {list(DriveStatus._value2member_map_.keys())}")

    # Validate job_type
    if job_type not in JobType._value2member_map_:
        raise ValueError(f"Invalid job_type '{job_type}'. Must be one of: {list(JobType._value2member_map_.keys())}")
    
    # Validate internship duration if job type is internship
    if job_type == JobType.INTERNSHIP and not internship_duration:
        raise ValueError("internship_duration is required when job_type is 'internship'")
    
    # Validate candidates_to_hire
    if not isinstance(candidates_to_hire, int) or candidates_to_hire < 1:
        raise ValueError("candidates_to_hire must be a positive integer")

    drive_data = {
        "job_id": job_id,
        "company_id": company_id,
        "role": role,
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "candidates_to_hire": candidates_to_hire,
        "job_type": job_type,
        "rounds": rounds,
        "status": status,
        "skills": skills or [],
        "coding_question_ids": coding_question_ids or [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # Add internship_duration only if provided
    if internship_duration:
        drive_data["internship_duration"] = internship_duration

    return drive_data