from datetime import datetime

def create_drive_candidate(candidate_id, drive_id, resume_shortlisted="no", 
                           interview_scheduled="no", interview_completed="no", 
                           selected="no", feedback="NA", email_sent="no"):
    return {
        "candidate_id": candidate_id,
        "drive_id": drive_id,
        "resume_shortlisted": resume_shortlisted,
        "email_sent": email_sent,
        "interview_scheduled": interview_scheduled,
        "interview_completed": interview_completed,
        "selected": selected,
        "feedback": feedback,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
