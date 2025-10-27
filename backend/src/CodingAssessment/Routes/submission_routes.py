from flask import Blueprint, request, jsonify
from src.CodingAssessment.Controllers.submission_controller import (
    create_submission_controller,
    submit_question_controller,
    final_submit_controller,
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
    Called when user clicks "Submit Assessment" (or auto-created on first run).
    
    Payload:
    {
        "candidate_id": "candidate_123",
        "drive_id": "drive_456"
    }
    """
    return create_submission_controller()


@submission_bp.post("/submit-question")
def submit_question():
    """
    Submit a single question for evaluation.
    Called when user clicks "Run Code" button.
    Auto-creates submission if it doesn't exist.
    
    Payload:
    {
        "candidate_id": "candidate_123",
        "drive_id": "drive_456",
        "question_id": "question_789",
        "source_code": "def solution():\n    return 42",
        "language": "python",
        "time_taken": 120
    }
    """
    return submit_question_controller()


@submission_bp.post("/final-submit")
def final_submit():
    """
    Mark assessment as complete.
    Called when user clicks "Submit Assessment" button.
    
    Payload:
    {
        "candidate_id": "candidate_123",
        "drive_id": "drive_456"
    }
    """
    return final_submit_controller()


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