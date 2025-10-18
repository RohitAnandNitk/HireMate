from datetime import datetime
from enum import Enum

class DriveStatus(str, Enum):
    RESUME_UPLOADED = "resumeUploaded"
    RESUME_SHORTLISTED = "resumeShortlisted"
    EMAIL_SENT = "emailSent"
    # Dynamic round statuses will be generated based on rounds
    SELECTION_EMAIL_SENT = "selectionEmailSent"
    COMPLETED = "completed"

class JobType(str, Enum):
    FULL_TIME = "full-time"
    INTERNSHIP = "internship"

class RoundStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


def generate_round_statuses(rounds):
    """
    Generate status fields for each round dynamically.
    Returns a list of round status objects.
    """
    round_statuses = []
    for idx, round_info in enumerate(rounds):
        round_statuses.append({
            "round_number": idx + 1,
            "round_type": round_info.get("type"),
            "status": RoundStatus.PENDING,
            "scheduled": "no",
            "completed": "no",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
    return round_statuses


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
    Create a drive (job posting) document with dynamic round statuses.
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

    # Generate round statuses dynamically
    round_statuses = generate_round_statuses(rounds)

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
        "round_statuses": round_statuses,  # Dynamic round tracking
        "current_round": 0,  # Track which round is currently active
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