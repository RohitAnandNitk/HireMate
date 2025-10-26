from flask import request, jsonify
from werkzeug.utils import secure_filename
import cloudinary.uploader
from src.Orchestrator.HiringOrchestrator import create_driveCandidate
from src.Config.cloudinary_config import cloudinary

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

    uploaded_urls = []

    for file in files:
        filename = secure_filename(file.filename)
        print(f"Uploading {filename} to Cloudinary...")

        # Upload PDF/DOC as raw file to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            resource_type="raw",
            folder="resumes"
        )

        resume_url = result["secure_url"]
        uploaded_urls.append(resume_url)

    # Pass URLs instead of file paths
    result = create_driveCandidate(uploaded_urls, skills, job_role, drive_id)

    return jsonify({
        "status": "success",
        "uploaded_urls": uploaded_urls,
        "response": result
    })
