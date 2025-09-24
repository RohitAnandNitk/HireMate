from bson import ObjectId
from flask import jsonify, request
from src.Model.Drive import create_drive
from src.Utils.Database import db
from datetime import datetime

def create_drive_controller():
    data = request.get_json()
    company_id = data.get("company_id")
    role = data.get("role")
    location = data.get("location")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    rounds = data.get("rounds", [])
    job_id = data.get("job_id")

    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    # Check if job_id is unique
    existing_drive = db.drives.find_one({"job_id": job_id})
    if existing_drive:
        return jsonify({"error": f"job_id '{job_id}' already exists"}), 400

    # Create drive instance
    drive = create_drive(company_id, role, location, start_date, end_date)
    drive["rounds"] = rounds
    drive["job_id"] = job_id

    result = db.drives.insert_one(drive)

    # Convert _id to string before returning
    drive["_id"] = str(result.inserted_id)

    return jsonify({
        "message": "Drive created successfully",
        "drive": drive
    }), 201


def get_drives_by_company(company_id):
    """
    Get all drives for a company
    """
    drives = list(db.drives.find({"company_id": company_id}))
    for drive in drives:
        drive["_id"] = str(drive["_id"])  # Convert ObjectId to string for JSON
    return jsonify({"drives": drives}), 200
