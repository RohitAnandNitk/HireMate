from flask import Blueprint, request
from src.Controllers import interview_controller

interview_bp = Blueprint("interview", __name__)

@interview_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    print("Uploading resume router...")
    if "resume" not in request.files:
        return {"error": "No resume uploaded"}, 400
    file = request.files["resume"]
    return interview_controller.upload_resume_controller(file)

@interview_bp.route("/start", methods=["POST"])
def start_interview():
    return interview_controller.start_interview()
