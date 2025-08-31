from flask import Flask
from flask_cors import CORS
import os
from src.Routes.interview_routes import interview_bp
# from src.Utils.VapiService import vapiServices  # ensure vapi initializes at startup

app = Flask(__name__, static_folder="static", static_url_path="/static")

# Ensure TTS folder exists (for saving generated audio if needed)
os.makedirs(os.path.join(app.static_folder, "tts"), exist_ok=True)

# Register routes
app.register_blueprint(interview_bp, url_prefix="/api/interview")

# Enable CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

if __name__ == "__main__":
    # Optional: Print confirmation that Vapi agent is loaded
    print("✅ Flask server started with Mock Interview Agent")
    app.run(host="0.0.0.0", port=5000, debug=True)
