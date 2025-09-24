from flask import Blueprint
from src.Controllers.drive_controller import create_drive_controller, get_drives_by_company

drive_bp = Blueprint("drive_bp", __name__, url_prefix="/api/drive")

# Create a new drive
drive_bp.route("/create", methods=["POST"])(create_drive_controller)

# Get all drives for a company
drive_bp.route("/company/<company_id>", methods=["GET"])(get_drives_by_company)
