from datetime import datetime

def create_candidate(name, email, resume_content, resume_shortlisted="no", selected="no"):
    return {
        "name": name,
        "email": email,
        "resume_content": resume_content,
        "resume_shortlisted": resume_shortlisted,
        "selected": selected,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
