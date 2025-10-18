from bson import ObjectId
from flask import jsonify, request
from src.Model.Drive import create_drive, JobType, DriveStatus, RoundStatus
from src.Model.CodingQuestion import create_coding_question
from src.Model.DriveCandidate import initialize_candidate_rounds
from src.Utils.Database import db
from datetime import datetime
from src.Orchestrator.HiringOrchestrator import (
    shortlist_candidates,
    email_candidates,
    schedule_interviews,
    send_final_selection_emails
)

from src.Tasks.tasks import (
    email_candidates_task, 
    send_final_selection_emails_task, 
    schedule_interviews_task,
    schedule_coding_assessments_task
)


def create_drive_controller():
    """
    Create a new drive with optional coding questions and dynamic round tracking.
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

    # Create drive instance with dynamic round tracking
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
    print(f"Number of rounds: {len(rounds)}")
    print(f"Number of coding questions: {len(coding_question_ids)}")
    
    return jsonify({
        "message": "Drive created successfully",
        "drive": drive,
        "coding_questions_count": len(coding_question_ids),
        "rounds_count": len(rounds)
    }), 201


def get_drives_by_company(company_id):
    """
    Get all drives for a specific company with round progress.
    """
    try:
        print(f"Fetching drives for company_id: {company_id}")
        
        # Query using company_id as a STRING
        drives = list(db.drives.find({"company_id": company_id}))
        
        print(f"Found {len(drives)} drives for company {company_id}")
        
        # Convert _id to string and add progress info
        for drive in drives:
            drive["_id"] = str(drive["_id"])
            
            # Add progress information
            current_round = drive.get("current_round", 0)
            total_rounds = len(drive.get("rounds", []))
            
            drive["progress"] = {
                "current_round": current_round,
                "total_rounds": total_rounds,
                "percentage": (current_round / total_rounds * 100) if total_rounds > 0 else 0
            }
        
        return jsonify({"drives": drives}), 200
    except Exception as e:
        print(f"Error in get_drives_by_company: {str(e)}")
        return jsonify({"error": str(e)}), 400


def get_drive_by_id(drive_id):
    """
    Get a single drive by its ID with detailed round information.
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
        
        # Get candidate statistics for each round
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))
        
        round_progress = []
        for round_status in drive.get("round_statuses", []):
            round_num = round_status["round_number"]
            
            # Count candidates in each status for this round
            scheduled = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("scheduled") == "yes"
            )
            
            completed = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("completed") == "yes"
            )
            
            passed = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("result") == "passed"
            )
            
            round_progress.append({
                "round_number": round_num,
                "round_type": round_status["round_type"],
                "status": round_status["status"],
                "scheduled_count": scheduled,
                "completed_count": completed,
                "passed_count": passed,
                "total_candidates": len([c for c in candidates if c.get("resume_shortlisted") == "yes"])
            })
        
        drive["round_progress"] = round_progress
        
        print(f"Drive found successfully: {drive.get('job_id', 'No job_id')}")
        
        return jsonify({
            "message": "Drive retrieved successfully",
            "drive": drive
        }), 200
        
    except Exception as e:
        print(f"Error in get_drive_by_id: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_all_drives():
    """
    Get all drives with progress information.
    """
    try:
        print("Fetching all drives")
        
        drives = list(db.drives.find())
        
        # Convert ObjectId to string and add progress for each drive
        for drive in drives:
            drive["_id"] = str(drive["_id"])
            
            current_round = drive.get("current_round", 0)
            total_rounds = len(drive.get("rounds", []))
            
            drive["progress"] = {
                "current_round": current_round,
                "total_rounds": total_rounds,
                "percentage": (current_round / total_rounds * 100) if total_rounds > 0 else 0
            }
        
        print(f"Found {len(drives)} drives")
        
        return jsonify({
            "message": f"Retrieved {len(drives)} drives",
            "drives": drives,
            "count": len(drives)
        }), 200
        
    except Exception as e:
        print(f"Error in get_all_drives: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_next_round_type(drive_id, current_round_number):
    """
    Get the type of the next round for a drive.
    """
    drive = db.drives.find_one({"_id": ObjectId(drive_id)})
    if not drive:
        return None
    
    rounds = drive.get("rounds", [])
    if current_round_number < len(rounds):
        return rounds[current_round_number].get("type")
    return None


def update_drive_status(drive_id):
    """
    Update drive status with dynamic round handling.
    """
    try:
        print(f"Updating status for drive ID: {drive_id}")
        
        # Convert string ID to ObjectId
        try:
            object_id = ObjectId(drive_id)
        except Exception:
            return jsonify({"error": "Invalid drive ID format"}), 400
        
        data = request.get_json()
        new_status = data.get("status")
        round_number = data.get("round_number")  # Which round to update

        # Check if drive exists
        drive = db.drives.find_one({"_id": object_id})
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        # Fetch drive details
        job_role = drive.get("role", "")
        keywords = drive.get("skills", [])
        rounds = drive.get("rounds", [])
        current_round = drive.get("current_round", 0)

        # Fetch candidates
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))

        # Handle different statuses
        if new_status == DriveStatus.RESUME_SHORTLISTED:
            print("Calling shortlisting agent...")
            shortlist_result = shortlist_candidates(candidates, keywords, job_role)
            
            # Update all shortlisted candidates' rounds_status
            shortlisted_candidates = db.drive_candidates.find(
                {"drive_id": drive_id, "resume_shortlisted": "yes"}
            )
            
            for candidate in shortlisted_candidates:
                # Initialize rounds for shortlisted candidates
                rounds_status = initialize_candidate_rounds(rounds)
                db.drive_candidates.update_one(
                    {"_id": candidate["_id"]},
                    {"$set": {"rounds_status": rounds_status}}
                )
            
            print(f"Initialized round statuses for shortlisted candidates")

        elif new_status == DriveStatus.EMAIL_SENT:
            print("Queueing email sending task...")
            task_result = email_candidates_task.delay(drive_id)
            print(f"Task queued with ID: {task_result.id}")

        elif new_status == "ROUND_SCHEDULING":
            # Handle round-specific scheduling
            if round_number is None:
                round_number = current_round + 1
            
            if round_number > len(rounds):
                return jsonify({"error": "Invalid round number"}), 400
            
            round_type = rounds[round_number - 1].get("type")
            
            print(f"Scheduling round {round_number}: {round_type}")
            
            if round_type == "Coding":
                print(f"Scheduling coding assessment for round {round_number}...")
                task_result = schedule_coding_assessments_task.delay(drive_id, round_number)
                print(f"Coding assessment task queued with ID: {task_result.id}")
            else:
                print(f"Scheduling interviews for round {round_number} ({round_type})...")
                task_result = schedule_interviews_task.delay(drive_id, round_number)
                print(f"Interview task queued with ID: {task_result.id}")
            
            # Update round status
            db.drives.update_one(
                {"_id": object_id, "round_statuses.round_number": round_number},
                {
                    "$set": {
                        "round_statuses.$.status": RoundStatus.IN_PROGRESS,
                        "round_statuses.$.scheduled": "yes",
                        "round_statuses.$.updated_at": datetime.utcnow(),
                        "current_round": round_number,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return jsonify({
                "message": f"Round {round_number} scheduling initiated",
                "round_number": round_number,
                "round_type": round_type,
                "drive_id": drive_id
            }), 200

        elif new_status == "ROUND_COMPLETED":
            # Mark a round as completed
            if round_number is None:
                return jsonify({"error": "round_number is required for ROUND_COMPLETED status"}), 400
            
            db.drives.update_one(
                {"_id": object_id, "round_statuses.round_number": round_number},
                {
                    "$set": {
                        "round_statuses.$.status": RoundStatus.COMPLETED,
                        "round_statuses.$.completed": "yes",
                        "round_statuses.$.updated_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            print(f"Round {round_number} marked as completed")
            
            # Check if all rounds are completed
            updated_drive = db.drives.find_one({"_id": object_id})
            all_rounds_completed = all(
                rs.get("status") == RoundStatus.COMPLETED 
                for rs in updated_drive.get("round_statuses", [])
            )
            
            if all_rounds_completed:
                print("All rounds completed, moving to final selection...")
                new_status = DriveStatus.SELECTION_EMAIL_SENT
                
                # Queue final selection emails
                task_result = send_final_selection_emails_task.delay(drive_id)
                print(f"Final selection task queued with ID: {task_result.id}")
                
                # Update drive status to completed
                db.drives.update_one(
                    {"_id": object_id},
                    {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
                )
                
                return jsonify({
                    "message": "All rounds completed. Final selection emails initiated.",
                    "status": new_status,
                    "drive_id": drive_id
                }), 200
            else:
                next_round = round_number + 1 if round_number < len(rounds) else None
                return jsonify({
                    "message": f"Round {round_number} marked as completed",
                    "next_round": next_round,
                    "next_round_type": rounds[next_round - 1].get("type") if next_round else None
                }), 200

        elif new_status == DriveStatus.SELECTION_EMAIL_SENT:
            print("Queueing final selection emails task...")
            task_result = send_final_selection_emails_task.delay(drive_id)
            print(f"Task queued with ID: {task_result.id}")

        # Validate and update status if it's a standard status
        if new_status in DriveStatus._value2member_map_:
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
                "current_round": current_round,
                "updated_at": datetime.utcnow().isoformat()
            }), 200
        
    except Exception as e:
        print(f"Error in update_drive_status: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_drive_progress(drive_id):
    """
    Get detailed progress information for a drive including all rounds.
    """
    try:
        object_id = ObjectId(drive_id)
        drive = db.drives.find_one({"_id": object_id})
        
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        # Get candidate statistics for each round
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))
        total_candidates = len([c for c in candidates if c.get("resume_shortlisted") == "yes"])
        
        round_stats = []
        for round_status in drive.get("round_statuses", []):
            round_num = round_status["round_number"]
            
            # Count candidates in each status for this round
            scheduled = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("scheduled") == "yes"
            )
            
            completed = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("completed") == "yes"
            )
            
            passed = sum(
                1 for c in candidates 
                if len(c.get("rounds_status", [])) >= round_num 
                and c["rounds_status"][round_num - 1].get("result") == "passed"
            )
            
            round_stats.append({
                "round_number": round_num,
                "round_type": round_status["round_type"],
                "status": round_status["status"],
                "scheduled_count": scheduled,
                "completed_count": completed,
                "passed_count": passed,
                "total_candidates": total_candidates,
                "completion_percentage": (completed / total_candidates * 100) if total_candidates > 0 else 0
            })
        
        return jsonify({
            "drive_id": drive_id,
            "job_id": drive.get("job_id"),
            "role": drive.get("role"),
            "current_round": drive.get("current_round", 0),
            "total_rounds": len(drive.get("rounds", [])),
            "overall_status": drive.get("status"),
            "total_candidates": total_candidates,
            "round_details": round_stats
        }), 200
        
    except Exception as e:
        print(f"Error in get_drive_progress: {str(e)}")
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
    Get all candidates for a specific drive with their round progress.
    """
    try:
        print(f"Fetching candidates for drive_id: {drive_id}")
        
        # Query using drive_id as a STRING
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))
        
        print(f"Found {len(candidates)} candidates for drive {drive_id}")
        
        # Convert _id to string and add progress info
        for candidate in candidates:
            candidate["_id"] = str(candidate["_id"])
            
            # Calculate current round for candidate
            rounds_status = candidate.get("rounds_status", [])
            current_round = candidate.get("current_round", 0)
            
            # Count completed rounds
            completed_rounds = sum(
                1 for rs in rounds_status if rs.get("completed") == "yes"
            )
            
            candidate["progress"] = {
                "current_round": current_round,
                "completed_rounds": completed_rounds,
                "total_rounds": len(rounds_status)
            }
        
        return jsonify({"candidates": candidates, "count": len(candidates)}), 200
    except Exception as e:
        print(f"Error in get_drive_candidates: {str(e)}")
        return jsonify({"error": str(e)}), 400


def get_drive_id_by_job():
    """
    Get drive IDs by job ID.
    """
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
    """
    Get shortlisted candidates for a job with their round progress.
    """
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

        # Step 2: Get shortlisted candidates
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

        # Step 3: Build result with round progress
        result = []
        for cand in drive_candidates:
            rounds_status = cand.get("rounds_status", [])
            current_round = cand.get("current_round", 0)
            
            result.append({
                "candidate_id": cand.get("candidate_id"),
                "resume_shortlisted": cand.get("resume_shortlisted"),
                "selected": cand.get("selected"),
                "current_round": current_round,
                "rounds_completed": sum(1 for rs in rounds_status if rs.get("completed") == "yes"),
                "total_rounds": len(rounds_status),
                "rounds_status": rounds_status
            })

        print(f"Total candidates returned: {len(result)}")

        return jsonify({
            "job_id": job_id,
            "drive_id": drive_id,
            "candidates": result,
            "count": len(result)
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Server error"}), 500