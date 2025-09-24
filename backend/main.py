from flask import Flask
from flask_cors import CORS
import os
from src.Routes.interview_routes import interview_bp
from src.Routes.resume_routes import resume_bp
from src.Routes.user_routes import auth_bp
from src.Routes.drive_routes import drive_bp
from src.Controllers.allresumes_controller import get_allresumes_controller
from src.Controllers import interview_controller


# Import the database to initialize connection
from src.Utils.Database import db

app = Flask(__name__, static_folder="static", static_url_path="/static")


# Enable CORS
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "https://www.hirekruit.com"]}},
    supports_credentials=True
)


# Register routes
app.register_blueprint(interview_bp, url_prefix="/api/interview")
app.register_blueprint(resume_bp, url_prefix="/api/resume")
app.register_blueprint(auth_bp, url_prefix="/api/user")
app.register_blueprint(drive_bp, url_prefix = "/api/drive")


if __name__ == "__main__":
    print("Flask server started on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
