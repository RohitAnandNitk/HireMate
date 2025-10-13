from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from src.Orchestrator.HiringOrchestrator import create_driveCandidate

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.normpath(os.path.join(BASE_DIR, '..', '..', 'uploads', 'resumes'))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def upload_resumes():
    print("Received request to upload resumes")
    if 'resumes' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    
    files = request.files.getlist('resumes')
    skills = request.form.get('skills')
    job_role = request.form.get('job_role')
    drive_id = request.form.get('drive_id')
    print(f"Drive ID: {drive_id}, Job Role: {job_role}, Skills: {skills}")

    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    saved_files = []
    file_paths = []

    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.normpath(os.path.join(UPLOAD_FOLDER, filename))
        print("Saving to:", file_path)
        file.save(file_path)
        saved_files.append(filename)
        file_paths.append(file_path)

    result = create_driveCandidate(file_paths, skills, job_role, drive_id)

    return jsonify({
        "status": "success",
        "response": result
    })
