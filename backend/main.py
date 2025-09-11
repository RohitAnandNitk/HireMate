from flask import Flask
from flask_cors import CORS
import os
from src.Routes.interview_routes import interview_bp
from src.Routes.resume_routes import resume_bp
from src.Controllers.allresumes_controller import get_allresumes_controller
# from src.Utils.VapiService import vapiServices  # ensure vapi initializes at startup

# Import the database to initialize connection
from src.Utils.Database import db

app = Flask(__name__, static_folder="static", static_url_path="/static")

# Ensure TTS folder exists (for saving generated audio if needed)
# os.makedirs(os.path.join(app.static_folder, "tts"), exist_ok=True)

# Register routes
app.register_blueprint(interview_bp, url_prefix="/api/interview")
app.register_blueprint(resume_bp, url_prefix="/api/resume")

# Enable CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

if __name__ == "__main__":
    print("Flask server started on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
