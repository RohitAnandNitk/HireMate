from flask import Blueprint
from src.Controllers.resume_controllers import upload_resumes
from src.Controllers.allresumes_controller import get_allresumes_controller

resume_bp = Blueprint('resume', __name__)

# Route to upload resumes
@resume_bp.route('/upload-resumes', methods=['POST'])
def handle_upload_resumes():
    print("Upload resumes endpoint hit")
    return upload_resumes()

@resume_bp.route("/all", methods=["GET"])
def get_all_resumes():
    return get_allresumes_controller()
