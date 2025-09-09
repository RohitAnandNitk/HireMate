import os, json
from flask import request, jsonify
from werkzeug.utils import secure_filename
from src.Utils.Database import db
from src.Agents.ResumeIntakeAgent import ResumeIntakeAgent
from datetime import datetime

UPLOAD_FOLDER = './uploads/resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

resume_agent = ResumeIntakeAgent()

from datetime import datetime

def upload_resumes():
    print("upload_resumes controller function called")
    if 'resumes' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    
    files = request.files.getlist('resumes')
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    saved_files = []
    file_paths = []

    # Save all files first
    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        saved_files.append(filename)
        file_paths.append(file_path)

    # Process all resumes at once
    extracted_info_list = resume_agent.process_resumes(file_paths)

    candidates = []

    for extracted_info in extracted_info_list:
        candidate_data = {
            "name": extracted_info["name"],
            "email": extracted_info["email"],
            "resume_content": extracted_info["resume_content"],
            "resume_shortlisted": "no",
            "selected": "no",
            "updated_at": datetime.utcnow()
        }

        # Preserve created_at if candidate already exists
        existing_candidate = db.candidates.find_one({"email": candidate_data["email"]})
        if existing_candidate:
            candidate_data["created_at"] = existing_candidate["created_at"]
        else:
            candidate_data["created_at"] = datetime.utcnow()

        # Upsert into MongoDB
        db.candidates.update_one(
            {"email": candidate_data["email"]},  # match by email
            {"$set": candidate_data},            # update fields
            upsert=True                          # insert if not found
        )

        candidates.append(candidate_data)

    return jsonify({
        "message": "Resumes uploaded and processed successfully",
        "files": saved_files,
        "candidates": candidates
    })
