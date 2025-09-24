from datetime import datetime

def create_company(name, industry=None, location=None):
    return {
        "name": name,
        "industry": industry,
        "location": location,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
