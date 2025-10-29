from flask import Blueprint
from src.Controllers.resume_controllers import upload_resumes
from src.Controllers.allresumes_controller import get_all_drives_candidates_controller , get_drive_candidates_controller

resume_bp = Blueprint('resume', __name__)

# Route to upload resumes
@resume_bp.route('/upload-resumes', methods=['POST'])
def handle_upload_resumes():
    print("Upload resumes endpoint hit")
    return upload_resumes()


# In your routes file
@resume_bp.route('/<drive_id>/candidates', methods=['GET'])
def get_drive_candidates(drive_id):
    print("get drive candidate route called")
    return get_drive_candidates_controller(drive_id)

# Optional: Get all drives with candidate counts
@resume_bp.route('/api/drives/candidates-summary', methods=['GET'])
def get_drives_candidates_summary():
    return get_all_drives_candidates_controller()
