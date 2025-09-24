from flask import Blueprint

from src.Controllers.user_controller import register_user


auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def handle_user() :
    print("New user registration route called")
    return register_user()
    