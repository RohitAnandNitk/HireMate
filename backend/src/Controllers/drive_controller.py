from bson import ObjectId
from flask import jsonify, request
from src.Model.Drive import create_drive
from src.Utils.Database import db
from datetime import datetime
from src.Model.Drive import DriveStatus
from src.Orchestrator.HiringOrchestrator import (
    shortlist_candidates,
    email_candidates,
    schedule_interviews,
    send_final_selection_emails
)

# Cretate a new drive
def create_drive_controller():
    print("Create Drive Controller called.")
    data = request.get_json()
    
    company_id = data.get("company_id")
    role = data.get("role")
    location = data.get("location")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    rounds = data.get("rounds", [])
    job_id = data.get("job_id")
    skills = data.get("skills", [])

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
    drive["skills"] = skills

    result = db.drives.insert_one(drive)

    # Convert _id to string before returning
    drive["_id"] = str(result.inserted_id)
    print("Drive created successfully.")
    return jsonify({
        "message": "Drive created successfully",
        "drive": drive
    }), 201

# Get drives by company id
def get_drives_by_company(company_id):
    """
    Get all drives for a company
    """
    drives = list(db.drives.find({"company_id": company_id}))
    for drive in drives:
        drive["_id"] = str(drive["_id"])  # Convert ObjectId to string for JSON
    return jsonify({"drives": drives}), 200


# Get drive by id
def get_drive_by_id(drive_id):
    """
    Get a single drive by its ID
    """
    try:
        print(f"Fetching drive with ID: {drive_id}")
        
        # Convert string ID to ObjectId
        try:
            object_id = ObjectId(drive_id)
        except Exception:
            return jsonify({"error": "Invalid drive ID format"}), 400
        
        # Find the drive in database
        drive = db.drives.find_one({"_id": object_id})
        
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        # Convert ObjectId to string for JSON serialization
        drive["_id"] = str(drive["_id"])
        
        print(f"Drive found successfully: {drive.get('job_id', 'No job_id')}")
        
        return jsonify({
            "message": "Drive retrieved successfully",
            "drive": drive
        }), 200
        
    except Exception as e:
        print(f"Error in get_drive_by_id: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

#gel all drives
def get_all_drives():
    """
    Get all drives (optional - for admin purposes)
    """
    try:
        print("Fetching all drives")
        
        drives = list(db.drives.find())
        
        # Convert ObjectId to string for each drive
        for drive in drives:
            drive["_id"] = str(drive["_id"])
        
        print(f"Found {len(drives)} drives")
        
        return jsonify({
            "message": f"Retrieved {len(drives)} drives",
            "drives": drives,
            "count": len(drives)
        }), 200
        
    except Exception as e:
        print(f"Error in get_all_drives: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# Update your existing update_drive_status function to fix ObjectId handling
def update_drive_status(drive_id):
    try:
        print(f"Updating status for drive ID: {drive_id}")
        
        # Convert string ID to ObjectId
        try:
            object_id = ObjectId(drive_id)
        except Exception:
            return jsonify({"error": "Invalid drive ID format"}), 400
        
        data = request.get_json()
        new_status = data.get("status")

        # print(f"New status: {new_status}")

        # Validate status
        if new_status not in DriveStatus._value2member_map_:
            return jsonify({
                "error": f"Invalid status '{new_status}'. Valid statuses: {list(DriveStatus._value2member_map_.keys())}"
            }), 400

        # Check if drive exists
        drive = db.drives.find_one({"_id": object_id})
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        # Here we first fetch the drive details with driveid(role and skills).
        drive_details = db.drives.find_one({"_id": object_id}, {"role": 1, "skills": 1})
        job_role = drive_details.get("role", "")
        keywords = drive_details.get("skills", [])

        # print(f"Drive details - Role: {job_role}, Skills: {keywords}")

        # now fetch all the candidates associated with this driveid
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))
        print("Found candidates for this drive:", candidates)

        # Here for different status we need to call the Agents for the respective tasks then update the status

        if new_status == DriveStatus.RESUME_SHORTLISTED:
            print("Calling shortlisting agent...")
            # Call your shortlisting agent here
            shortlist_result = shortlist_candidates(candidates, keywords, job_role)
            print(f"Shortlisting result: {shortlist_result}")

        elif new_status == DriveStatus.EMAIL_SENT:
            print("Calling email sending agent...")
            # Call your email sending agent here
            # email_sending_agent(drive_id)

        elif new_status == DriveStatus.INTERVIEW_SCHEDULED:
            print("Calling interview scheduling agent...")
            # Call your interview scheduling agent here
            # interview_scheduling_agent(drive_id)

        elif new_status == DriveStatus.SELECTION_EMAIL_SENT:
            print("Calling selection email agent...")
            # Call your selection email agent here
            # selection_email_agent(drive_id)

        # Update the drive status
        result = db.drives.update_one(
            {"_id": object_id},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Failed to update drive status"}), 500

        print(f"Drive status updated successfully to: {new_status}")

        return jsonify({
            "message": "Drive status updated successfully", 
            "status": new_status,
            "drive_id": drive_id,
            "updated_at": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error in update_drive_status: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500