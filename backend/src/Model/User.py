from datetime import datetime

def create_user(name, email, password_hash, company_name, role="hr"):
    return {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "role": role,
        "company_name": company_name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }