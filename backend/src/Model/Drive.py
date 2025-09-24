from datetime import datetime

def create_drive(company_id, role, location, start_date, end_date, rounds=None, job_id=None):
    """
    Create a drive (job posting) document.

    rounds: list of dicts, e.g. [{"type": "Technical", "description": ""}, {"type": "HR", "description": ""}]
    job_id: optional custom job identifier
    """
    if rounds is None:
        rounds = [{"type": "Technical", "description": ""}]

    return {
        "job_id": job_id,           # optional, can be generated later if None
        "company_id": company_id,   # reference to company
        "role": role,               # e.g., "Software Engineer Intern"
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "rounds": rounds,           # interview rounds info
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
