from bson import ObjectId
from flask import jsonify, request
from src.Model.Drive import create_drive, JobType
from src.Model.CodingQuestion import create_coding_question
from src.Utils.Database import db
from datetime import datetime
from src.Model.Drive import DriveStatus
from src.Orchestrator.HiringOrchestrator import (
    shortlist_candidates,
    email_candidates,
    schedule_interviews,
    send_final_selection_emails
)

from src.Tasks.tasks import email_candidates_task, send_final_selection_emails_task, schedule_interviews_task


def create_drive_controller():
    """
    Create a new drive with optional coding questions.
    """
    print("Create Drive Controller called.")
    data = request.get_json()
    
    # Extract required fields
    company_id = data.get("company_id")
    role = data.get("role")
    location = data.get("location")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    job_id = data.get("job_id")
    candidates_to_hire = data.get("candidates_to_hire")
    
    # Extract optional fields
    rounds = data.get("rounds", [])
    skills = data.get("skills", [])
    job_type = data.get("job_type", JobType.FULL_TIME)
    internship_duration = data.get("internship_duration")
    coding_questions = data.get("coding_questions", [])

    # Validation
    if not company_id:
        return jsonify({"error": "company_id is required"}), 400

    if not job_id:
        return jsonify({"error": "job_id is required"}), 400
    
    if not candidates_to_hire:
        return jsonify({"error": "candidates_to_hire is required"}), 400
    
    try:
        candidates_to_hire = int(candidates_to_hire)
        if candidates_to_hire < 1:
            return jsonify({"error": "candidates_to_hire must be a positive integer"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "candidates_to_hire must be a valid integer"}), 400

    # Check if job_id is unique
    existing_drive = db.drives.find_one({"job_id": job_id})
    if existing_drive:
        return jsonify({"error": f"job_id '{job_id}' already exists"}), 400
    
    # Validate job type and internship duration
    if job_type == JobType.INTERNSHIP or job_type == "internship":
        if not internship_duration:
            return jsonify({"error": "internship_duration is required for internship job type"}), 400

    # Process coding questions if provided
    coding_question_ids = []
    if coding_questions and len(coding_questions) > 0:
        try:
            for idx, question in enumerate(coding_questions):
                # Create coding question document
                coding_question = create_coding_question(
                    title=question.get("title"),
                    description=question.get("description"),
                    test_cases=question.get("testCases", []),
                    constraints=question.get("constraints", ""),
                    difficulty=question.get("difficulty", "medium"),
                    tags=question.get("tags", []),
                    time_limit=question.get("time_limit"),
                    memory_limit=question.get("memory_limit"),
                    company_id=company_id
                )
                
                # Insert coding question into database
                result = db.coding_questions.insert_one(coding_question)
                coding_question_ids.append(str(result.inserted_id))
                
            print(f"Created {len(coding_question_ids)} coding questions")
        except ValueError as e:
            return jsonify({"error": f"Invalid coding question data: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": f"Error creating coding questions: {str(e)}"}), 500

    # Create drive instance
    try:
        drive = create_drive(
            company_id=company_id,
            role=role,
            location=location,
            start_date=start_date,
            end_date=end_date,
            candidates_to_hire=candidates_to_hire,
            job_type=job_type,
            skills=skills,
            rounds=rounds,
            job_id=job_id,
            internship_duration=internship_duration,
            coding_question_ids=coding_question_ids
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Insert drive into database
    result = db.drives.insert_one(drive)

    # Convert _id to string before returning
    drive["_id"] = str(result.inserted_id)
    
    print(f"Drive created successfully with company_id: {company_id}, job_id: {job_id}")
    print(f"Number of coding questions: {len(coding_question_ids)}")
    
    return jsonify({
        "message": "Drive created successfully",
        "drive": drive,
        "coding_questions_count": len(coding_question_ids)
    }), 201


def get_drives_by_company(company_id):
    """
    Get all drives for a specific company.
    company_id is expected to be a STRING (e.g., "comp_01"), not an ObjectId
    """
    try:
        print(f"Fetching drives for company_id: {company_id}")
        
        # Query using company_id as a STRING, not ObjectId
        drives = list(db.drives.find({"company_id": company_id}))
        
        print(f"Found {len(drives)} drives for company {company_id}")
        
        # Convert _id to string for JSON serialization
        for drive in drives:
            drive["_id"] = str(drive["_id"])
            # company_id is already a string, no need to convert
        
        return jsonify({"drives": drives}), 200
    except Exception as e:
        print(f"Error in get_drives_by_company: {str(e)}")
        return jsonify({"error": str(e)}), 400


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


# Get all drives
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


# Update drive status
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

        # Validate status
        if new_status not in DriveStatus._value2member_map_:
            return jsonify({
                "error": f"Invalid status '{new_status}'. Valid statuses: {list(DriveStatus._value2member_map_.keys())}"
            }), 400

        # Check if drive exists
        drive = db.drives.find_one({"_id": object_id})
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        # Fetch drive details
        drive_details = db.drives.find_one({"_id": object_id}, {"role": 1, "skills": 1})
        job_role = drive_details.get("role", "")
        keywords = drive_details.get("skills", [])

        # Fetch candidates
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))

        # Handle different statuses
        if new_status == DriveStatus.RESUME_SHORTLISTED:
            print("Calling shortlisting agent...")
            shortlist_result = shortlist_candidates(candidates, keywords, job_role)

        elif new_status == DriveStatus.EMAIL_SENT:
            print("Queueing email sending task...")
            task_result = email_candidates_task.delay(drive_id)
            print(f"Task queued with ID: {task_result.id}")

        elif new_status == DriveStatus.INTERVIEW_SCHEDULED:
            print("Queueing interview scheduling task...")
            task_result = schedule_interviews_task.delay(drive_id)
            print(f"Task queued with ID: {task_result.id}")

        elif new_status == DriveStatus.SELECTION_EMAIL_SENT:
            print("Queueing final selection emails task...")
            task_result = send_final_selection_emails_task.delay(drive_id)
            print(f"Task queued with ID: {task_result.id}")

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
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_hr_info(hr_mail):
    """
    Fetch HR info from the User collection by email.
    """
    try:
        print(f"Fetching HR info for email: {hr_mail}")
        user = db.users.find_one({"email": hr_mail})

        if not user:
            print(f"No user found with email: {hr_mail}")
            return None
        
        # Convert ObjectId to string for JSON serialization
        user["_id"] = str(user["_id"])
        
        print(f"Found user: {user.get('name', 'Unknown')} with company_id: {user.get('company_id', 'None')}")
        return user

    except Exception as e:
        print(f"Error fetching HR info: {str(e)}")
        return None

def get_drive_candidates(drive_id):
    """
    Get all candidates for a specific drive.
    drive_id is expected to be a STRING (e.g., "64b8f0c2e1b1f5a3c4d2e9b7"), not an ObjectId
    """
    try:
        print(f"Fetching candidates for drive_id: {drive_id}")
        
        # Query using drive_id as a STRING, not ObjectId
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))
        
        print(f"Found {len(candidates)} candidates for drive {drive_id}")
        
        # Convert _id to string for JSON serialization
        for candidate in candidates:
            candidate["_id"] = str(candidate["_id"])
            # drive_id is already a string, no need to convert
        
        return jsonify({"candidates": candidates}), 200
    except Exception as e:
        print(f"Error in get_drive_candidates: {str(e)}")
        return jsonify({"error": str(e)}), 400
    
# testing(rahul)
def get_drive_id_by_job():
    job_id = request.args.get("job_id")

    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    try:
        print(f"Fetching drive_id for job_id: {job_id}")

        # Query drives matching job_id
        drives = list(db.drives.find({"job_id": job_id}, {"_id": 1}))

        if not drives:
            return jsonify({"message": "No drives found for this job_id"}), 404

        # Extract only drive IDs and convert ObjectId to string
        drive_ids = [str(d["_id"]) for d in drives]

        print(f"Found drive_ids: {drive_ids}")

        return jsonify({"drive_ids": drive_ids}), 200

    except Exception as e:
        print(f"Error in get_drive_id_by_job: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


def get_shortlisted_candidates_by_job():
    job_id = request.args.get("job_id")
    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    try:
        # Step 1: Find the drive
        drive = db.drives.find_one({"job_id": job_id})
        if not drive:
            return jsonify({"error": "No drive found for this job_id"}), 404

        drive_id = str(drive["_id"])
        print(f"Found drive: {drive_id} for job_id: {job_id}")

        # Step 2: Get shortlisted candidates directly
        drive_candidates = list(
            db.drive_candidates.find({
                "drive_id": drive_id,
                "resume_shortlisted": {"$in": ["yes", "Yes", True, "true"]}
            })
        )
        print(f"Total shortlisted candidates found: {len(drive_candidates)}")

        if not drive_candidates:
            return jsonify({
                "job_id": job_id,
                "drive_id": drive_id,
                "candidates": []
            }), 200

        # Step 3: Return info directly from drive_candidates
        result = []
        for cand in drive_candidates:
            result.append({
                "candidate_id": cand.get("candidate_id"),
                "resume_shortlisted": cand.get("resume_shortlisted"),
                "selected": cand.get("selected"),
                "interview_completed": cand.get("interview_completed"),
                # Add any other fields stored in drive_candidates
            })

        print(f"Total candidates returned: {len(result)}")

        return jsonify({
            "job_id": job_id,
            "drive_id": drive_id,
            "candidates": result
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Server error"}), 500
