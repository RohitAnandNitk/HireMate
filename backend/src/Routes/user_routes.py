from flask import Blueprint

from src.Controllers.user_controller import login_user, register_user, get_candidate_by_id


auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def handle_user() :
    print("New user registration route called")
    return register_user()

@auth_bp.route("/login", methods=["POST"])
def handle_login():
    print("User login route called")
    return login_user()

@auth_bp.route("/candidate", methods=["GET"])
def handle_candidate():
    print("Get candidate route called")
    return get_candidate_by_id()
