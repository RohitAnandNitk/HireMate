from datetime import datetime

def create_candidate(name, email, resume_content, interview_completed="no", resume_shortlisted="no", selected="no", feedback="NA", interview_scheduled="no"):
    return {
        "name": name,
        "email": email,
        "resume_content": resume_content,
        "interview_completed": interview_completed,
        "resume_shortlisted": resume_shortlisted,
        "interview_scheduled": interview_scheduled,
        "selected": selected,
        "feedback": feedback,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
