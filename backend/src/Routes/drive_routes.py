# Updated drive_routes.py

from flask import Blueprint, jsonify, request  # Add jsonify and request imports
from src.Controllers.drive_controller import (
    create_drive_controller, 
    get_drives_by_company, 
    update_drive_status,
    get_drive_by_id,
    get_all_drives,
    get_hr_info  # Add this import if get_hr_info is in drive_controller
)

drive_bp = Blueprint("drive_bp", __name__, url_prefix="/api/drive")

# Create a new drive
drive_bp.route("/create", methods=["POST"])(create_drive_controller)

# Get all drives for a company
drive_bp.route("/company/<company_id>", methods=["GET"])(get_drives_by_company)

# Get all drives (optional - for admin/debugging)
drive_bp.route("/all", methods=["GET"])(get_all_drives)

# Get a single drive by ID - NEW ROUTE
@drive_bp.route("/<drive_id>", methods=["GET"])
def get_drive(drive_id):
    return get_drive_by_id(drive_id)

# Update drive status
@drive_bp.route("/<drive_id>/status", methods=["PUT"])
def update_status(drive_id):
    return update_drive_status(drive_id)

# You can also add a route to get drive status only
@drive_bp.route("/<driveId>/status", methods=["GET"])
def get_drive_status(driveId):
    print("Get Drive Status route called.")
    from src.Controllers.drive_controller import get_drive_by_id
    response, status_code = get_drive_by_id(driveId)

    if status_code == 200:
        drive_data = response.get_json()
        return {
            "message": "Drive status retrieved successfully",
            "status": drive_data["drive"]["status"],
            "drive_id": driveId
        }, 200
    else:
        return response, status_code
    
@drive_bp.route("/hr-info", methods=["GET"])
def hr_info_route():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    hr_info = get_hr_info(email)
    if not hr_info:
        return jsonify({"error": "HR not found"}), 404

    return jsonify(hr_info), 200