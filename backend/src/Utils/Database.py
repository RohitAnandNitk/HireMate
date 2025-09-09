from pymongo import MongoClient, ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

try:
    # Try to connect to the server to verify connection
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

db = client.get_default_database()  # or client['yourdbname']

# Ensure email is unique in the candidates collection
try:
    db.candidates.create_index([("email", ASCENDING)], unique=True)
    print("Unique index on 'email' ensured.")
except Exception as e:
    print("Failed to create index:", e)
