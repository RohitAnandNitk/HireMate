from bson import ObjectId
from flask import jsonify, request
from src.Model.Submission import (
    create_submission,
    create_question_submission,
    update_submission_status,
    update_question_submission_result,
    calculate_submission_statistics,
    validate_submission_data,
    format_submission_response,
    get_language_id,
    determine_submission_result,
    SubmissionStatus,
    SubmissionResult,
    ProgrammingLanguage
)
from src.Utils.Database import db
from datetime import datetime
from src.CodingAssessment.Utils.judge0_client import submit_and_wait
from src.Model.CodingQuestion import get_coding_question_by_id


def create_submission_controller():
    """
    Create a new submission for a code assessment.
    """
    try:
        data = request.get_json()
        
        candidate_id = data.get("candidate_id")
        drive_id = data.get("drive_id")
        code_assessment_id = data.get("code_assessment_id")
        
        # Validation
        if not candidate_id:
            return jsonify({"error": "candidate_id is required"}), 400
        
        if not drive_id:
            return jsonify({"error": "drive_id is required"}), 400
        
        if not code_assessment_id:
            return jsonify({"error": "code_assessment_id is required"}), 400
        
        # Get coding questions for this assessment
        # Assuming code_assessment_id contains the coding question IDs
        drive = db.drives.find_one({"_id": ObjectId(drive_id)})
        if not drive:
            return jsonify({"error": "Drive not found"}), 404
        
        coding_question_ids = drive.get("coding_question_ids", [])
        total_questions = len(coding_question_ids)
        
        if total_questions == 0:
            return jsonify({"error": "No coding questions found for this drive"}), 400
        
        # Create submission
        submission = create_submission(
            candidate_id=candidate_id,
            drive_id=drive_id,
            code_assessment_id=code_assessment_id,
            total_questions=total_questions
        )
        
        # Validate submission data
        is_valid, error_msg = validate_submission_data(submission)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Insert into database
        result = db.submissions.insert_one(submission)
        submission["_id"] = str(result.inserted_id)
        
        print(f"Submission created successfully: {submission['_id']}")
        
        return jsonify({
            "message": "Submission created successfully",
            "submission": format_submission_response(submission)
        }), 201
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Error in create_submission_controller: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def submit_question_controller():
    """
    Submit a single question for evaluation.
    """
    try:
        data = request.get_json()
        
        submission_id = data.get("submission_id")
        question_id = data.get("question_id")
        source_code = data.get("source_code")
        language = data.get("language")
        time_taken = data.get("time_taken", 0)
        
        # Validation
        if not submission_id:
            return jsonify({"error": "submission_id is required"}), 400
        
        if not question_id:
            return jsonify({"error": "question_id is required"}), 400
        
        if not source_code:
            return jsonify({"error": "source_code is required"}), 400
        
        if not language:
            return jsonify({"error": "language is required"}), 400
        
        # Check if submission exists
        submission = db.submissions.find_one({"_id": ObjectId(submission_id)})
        if not submission:
            return jsonify({"error": "Submission not found"}), 404
        
        # Get coding question details
        coding_question = db.coding_questions.find_one({"_id": ObjectId(question_id)})
        if not coding_question:
            return jsonify({"error": "Coding question not found"}), 404
        
        test_cases = coding_question.get("test_cases", [])
        total_test_cases = len(test_cases)
        
        if total_test_cases == 0:
            return jsonify({"error": "No test cases found for this question"}), 400
        
        # Get question number
        question_number = len(submission.get("question_submissions", [])) + 1
        
        # Get language ID for Judge0
        try:
            language_id = get_language_id(language)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Create question submission
        question_sub = create_question_submission(
            question_id=question_id,
            question_number=question_number,
            source_code=source_code,
            language=language,
            total_test_cases=total_test_cases,
            time_taken=time_taken
        )
        
        # Check if question already submitted
        existing_question = next(
            (qs for qs in submission.get("question_submissions", []) 
             if qs.get("question_id") == question_id),
            None
        )
        
        if existing_question:
            # Update existing submission
            db.submissions.update_one(
                {"_id": ObjectId(submission_id), "question_submissions.question_id": question_id},
                {"$set": {
                    "question_submissions.$.source_code": source_code,
                    "question_submissions.$.language": language,
                    "question_submissions.$.time_taken": time_taken,
                    "question_submissions.$.status": SubmissionStatus.PENDING,
                    "question_submissions.$.updated_at": datetime.utcnow()
                }}
            )
        else:
            # Add new question submission
            db.submissions.update_one(
                {"_id": ObjectId(submission_id)},
                {"$push": {"question_submissions": question_sub}}
            )
        
        # Run the submission
        result = run_submission(
            code=source_code,
            language_id=language_id,
            submission_id=submission_id,
            question_id=question_id,
            test_cases=test_cases
        )
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Error in submit_question_controller: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def run_submission(code, language_id, submission_id, question_id, test_cases):
    """
    Run code submission against test cases and update database.
    """
    try:
        # Mark question as running
        db.submissions.update_one(
            {"_id": ObjectId(submission_id), "question_submissions.question_id": question_id},
            {"$set": {
                "question_submissions.$.status": SubmissionStatus.RUNNING,
                "question_submissions.$.updated_at": datetime.utcnow()
            }}
        )
        
        results = []
        test_cases_passed = 0
        total_test_cases = len(test_cases)
        total_execution_time = 0
        max_memory_used = 0
        error_messages = []
        
        # Run against each test case
        for idx, tc in enumerate(test_cases):
            tc_input = tc.get("input", "")
            expected_output = tc.get("output", "")
            
            # Submit to Judge0
            judge0_submission = submit_and_wait(
                source_code=code,
                language_id=language_id,
                stdin=tc_input
            )
            
            # Determine result
            actual_output = judge0_submission.get("stdout", "")
            result = determine_submission_result(
                judge0_submission.get("status", {}),
                expected_output,
                actual_output
            )
            
            # Count passed test cases
            if result == SubmissionResult.ACCEPTED:
                test_cases_passed += 1
            
            # Track execution metrics
            exec_time = float(judge0_submission.get("time", 0)) * 1000  # Convert to ms
            memory = float(judge0_submission.get("memory", 0)) / 1024  # Convert to MB
            total_execution_time += exec_time
            max_memory_used = max(max_memory_used, memory)
            
            # Collect error messages
            if judge0_submission.get("stderr"):
                error_messages.append(f"Test case {idx + 1}: {judge0_submission.get('stderr')}")
            if judge0_submission.get("compile_output"):
                error_messages.append(f"Compilation: {judge0_submission.get('compile_output')}")
            
            # Attach test case info
            judge0_submission["test_case_number"] = idx + 1
            judge0_submission["expected"] = expected_output
            judge0_submission["result"] = result
            results.append(judge0_submission)
        
        # Determine overall result
        if test_cases_passed == total_test_cases:
            overall_result = SubmissionResult.ACCEPTED
        elif test_cases_passed > 0:
            overall_result = SubmissionResult.WRONG_ANSWER
        else:
            overall_result = results[0]["result"] if results else SubmissionResult.ERROR
        
        # Update question submission
        update_fields = update_question_submission_result(
            status=SubmissionStatus.COMPLETED,
            result=overall_result,
            test_cases_passed=test_cases_passed,
            total_test_cases=total_test_cases,
            execution_time=int(total_execution_time),
            memory_used=round(max_memory_used, 2),
            error_message="\n".join(error_messages) if error_messages else None
        )
        
        db.submissions.update_one(
            {"_id": ObjectId(submission_id), "question_submissions.question_id": question_id},
            {"$set": update_fields}
        )
        
        # Update overall submission statistics
        update_overall_submission(submission_id)
        
        return {
            "success": True,
            "result": overall_result,
            "test_cases_passed": test_cases_passed,
            "total_test_cases": total_test_cases,
            "results": results
        }
        
    except Exception as e:
        # Mark question as error
        error_message = str(e)
        db.submissions.update_one(
            {"_id": ObjectId(submission_id), "question_submissions.question_id": question_id},
            {"$set": {
                "question_submissions.$.status": SubmissionStatus.ERROR,
                "question_submissions.$.result": SubmissionResult.ERROR,
                "question_submissions.$.error_message": error_message,
                "question_submissions.$.updated_at": datetime.utcnow()
            }}
        )
        
        return {
            "success": False,
            "error": error_message
        }


def update_overall_submission(submission_id):
    """
    Update overall submission statistics based on question submissions.
    """
    try:
        submission = db.submissions.find_one({"_id": ObjectId(submission_id)})
        if not submission:
            return
        
        question_submissions = submission.get("question_submissions", [])
        
        # Calculate statistics
        stats = calculate_submission_statistics(question_submissions)
        
        # Determine overall status
        if stats["all_completed"]:
            overall_status = SubmissionStatus.COMPLETED
            submitted_at = datetime.utcnow()
        else:
            overall_status = SubmissionStatus.RUNNING
            submitted_at = None
        
        # Update submission
        update_data = update_submission_status(
            status=overall_status,
            questions_solved=stats["questions_solved"],
            score_percentage=stats["score_percentage"],
            submitted_at=submitted_at
        )
        
        update_data["total_time_taken"] = stats["total_time_taken"]
        
        db.submissions.update_one(
            {"_id": ObjectId(submission_id)},
            {"$set": update_data}
        )
        
        print(f"Updated submission {submission_id}: {stats['questions_solved']}/{stats['total_questions']} solved ({stats['score_percentage']}%)")
        
    except Exception as e:
        print(f"Error updating overall submission: {str(e)}")


def get_submission_by_id(submission_id):
    """
    Get submission by ID.
    """
    try:
        submission = db.submissions.find_one({"_id": ObjectId(submission_id)})
        
        if not submission:
            return jsonify({"error": "Submission not found"}), 404
        
        return jsonify({
            "message": "Submission retrieved successfully",
            "submission": format_submission_response(submission)
        }), 200
        
    except Exception as e:
        print(f"Error in get_submission_by_id: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_submissions_by_candidate(candidate_id):
    """
    Get all submissions for a candidate.
    """
    try:
        submissions = list(db.submissions.find({"candidate_id": candidate_id}))
        
        formatted_submissions = [format_submission_response(sub) for sub in submissions]
        
        return jsonify({
            "message": f"Retrieved {len(submissions)} submissions",
            "submissions": formatted_submissions,
            "count": len(submissions)
        }), 200
        
    except Exception as e:
        print(f"Error in get_submissions_by_candidate: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_submissions_by_drive(drive_id):
    """
    Get all submissions for a drive.
    """
    try:
        submissions = list(db.submissions.find({"drive_id": drive_id}))
        
        formatted_submissions = [format_submission_response(sub) for sub in submissions]
        
        return jsonify({
            "message": f"Retrieved {len(submissions)} submissions",
            "submissions": formatted_submissions,
            "count": len(submissions)
        }), 200
        
    except Exception as e:
        print(f"Error in get_submissions_by_drive: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def get_submission_statistics(submission_id):
    """
    Get detailed statistics for a submission.
    """
    try:
        submission = db.submissions.find_one({"_id": ObjectId(submission_id)})
        
        if not submission:
            return jsonify({"error": "Submission not found"}), 404
        
        question_submissions = submission.get("question_submissions", [])
        stats = calculate_submission_statistics(question_submissions)
        
        # Add additional statistics
        stats["candidate_id"] = submission.get("candidate_id")
        stats["drive_id"] = submission.get("drive_id")
        stats["status"] = submission.get("status")
        stats["started_at"] = submission.get("started_at").isoformat() if submission.get("started_at") else None
        stats["submitted_at"] = submission.get("submitted_at").isoformat() if submission.get("submitted_at") else None
        
        # Question-wise breakdown
        question_breakdown = []
        for qs in question_submissions:
            question_breakdown.append({
                "question_number": qs.get("question_number"),
                "question_id": qs.get("question_id"),
                "result": qs.get("result"),
                "test_cases_passed": qs.get("test_cases_passed"),
                "total_test_cases": qs.get("total_test_cases"),
                "time_taken": qs.get("time_taken"),
                "execution_time": qs.get("execution_time"),
                "memory_used": qs.get("memory_used")
            })
        
        stats["question_breakdown"] = question_breakdown
        
        return jsonify({
            "message": "Statistics retrieved successfully",
            "statistics": stats
        }), 200
        
    except Exception as e:
        print(f"Error in get_submission_statistics: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500