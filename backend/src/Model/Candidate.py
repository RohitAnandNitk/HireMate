from datetime import datetime

def create_candidate(name, email, resume_content, resume_url):
    return {
        "name": name,
        "email": email,
        "resume_content": resume_content,
        "resume_url": resume_url,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
