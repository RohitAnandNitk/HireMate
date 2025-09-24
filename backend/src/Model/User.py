from datetime import datetime

def create_user(name, email, company_id, role="hr"):
    return {
        "name": name,
        "email": email,
        "role": role,  # "hr", "admin", etc.
        "company_id": company_id,  # Reference to Company
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
