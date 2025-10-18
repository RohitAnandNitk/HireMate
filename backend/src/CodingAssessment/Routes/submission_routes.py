from flask import Blueprint, request, jsonify
from src.CodingAssessment.Controllers.submission_controller import (
    create_submission_controller,
    submit_question_controller,
    get_submission_by_id,
    get_submissions_by_candidate,
    get_submissions_by_drive,
    get_submission_statistics
)

submission_bp = Blueprint("submission", __name__)


@submission_bp.post("/create")
def create_submission():
    """
    Create a new submission for a code assessment.
    
    Payload:
    {
        "candidate_id": "candidate_123",
        "drive_id": "drive_456",
        "code_assessment_id": "assessment_789"
    }
    """
    return create_submission_controller()


@submission_bp.post("/submit-question")
def submit_question():
    """
    Submit a single question for evaluation.
    
    Payload:
    {
        "submission_id": "submission_123",
        "question_id": "question_456",
        "source_code": "def solution():\n    return 42",
        "language": "python",
        "time_taken": 120
    }
    """
    return submit_question_controller()


@submission_bp.get("/<submission_id>")
def get_submission(submission_id):
    """
    Get submission by ID.
    
    Example: GET /api/submission/64b8f0c2e1b1f5a3c4d2e9b7
    """
    return get_submission_by_id(submission_id)


@submission_bp.get("/candidate/<candidate_id>")
def get_candidate_submissions(candidate_id):
    """
    Get all submissions for a specific candidate.
    
    Example: GET /api/submission/candidate/candidate_123
    """
    return get_submissions_by_candidate(candidate_id)


@submission_bp.get("/drive/<drive_id>")
def get_drive_submissions(drive_id):
    """
    Get all submissions for a specific drive.
    
    Example: GET /api/submission/drive/64b8f0c2e1b1f5a3c4d2e9b7
    """
    return get_submissions_by_drive(drive_id)


@submission_bp.get("/<submission_id>/statistics")
def get_statistics(submission_id):
    """
    Get detailed statistics for a submission.
    
    Example: GET /api/submission/64b8f0c2e1b1f5a3c4d2e9b7/statistics
    """
    return get_submission_statistics(submission_id)


# Legacy endpoint for backward compatibility (if needed)
@submission_bp.post("/run")
def run_code():
    """
    Run code without creating a submission (for testing purposes).
    
    Payload:
    {
        "code": "def solution():\n    return 42",
        "language_id": 71,
        "problem_id": "problem_123",
        "input": "optional custom input"
    }
    
    Note: This is a legacy endpoint. Use /submit-question for production.
    """
    payload = request.get_json(force=True)
    if not payload or "code" not in payload:
        return jsonify({"error": "Missing 'code' in request body"}), 400

    code = payload["code"]
    language_id = payload.get("language_id", 71)  # default: Python 3
    problem_id = payload.get("problem_id")
    custom_input = payload.get("input")  # optional

    print("Code:", code)
    print("Lang:", language_id)
    print("Prob:", problem_id)
    print("Custom input:", custom_input)

    # For backward compatibility, import the old run_submission if it exists
    try:
        from src.CodingAssessment.Controllers.submission_controller import run_submission_legacy
        result = run_submission_legacy(
            code=code, 
            language_id=language_id, 
            problem_id=problem_id, 
            custom_input=custom_input
        )
        return jsonify(result)
    except ImportError:
        return jsonify({
            "error": "Legacy endpoint deprecated. Please use /submit-question instead.",
            "migration_guide": {
                "step_1": "Create a submission using POST /api/submission/create",
                "step_2": "Submit questions using POST /api/submission/submit-question"
            }
        }), 410