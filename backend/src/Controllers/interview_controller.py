import asyncio
import io, json
from flask import jsonify, request
from src.Utils.VapiService import upload_resume
import pdfplumber
from src.Utils.Database import db 
from src.Agents.MockInterviewAgent import MockInterviewAgent
mock_interview_agent = MockInterviewAgent()

def extract_resume_text(file):
    """Extract text from uploaded resume (PDF)."""
    print("Extracting resume text...")
    text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise RuntimeError(f"Error extracting resume text: {str(e)}")
    print("resume extraction done")
    return text.strip()


def upload_resume_controller(file):
    print("Uploading resume...")
    try:
        resume_text = extract_resume_text(file)

        # Generate sessionId if not provided
        import uuid
        session_id = request.form.get("sessionId") or uuid.uuid4().hex
        print("sessionid : ", session_id)
        result = asyncio.run(upload_resume(session_id, resume_text))
        print("Resume uploaded successfully.")
        return jsonify({
            "sessionId": session_id,
            "resumeText": resume_text,
            "status": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def evaluate_interview_controller(resume_text, transcript):
    print("Evaluating interview Controller ...")
    # print("Resume Text:", resume_text)
    # print("\n")
    # print("Transcript:", transcript)
    
    try:
        # Extract only role and content from transcript with error handling
        conversation_only = []
        for msg in transcript:
            if 'role' in msg and 'content' in msg:
                conversation_only.append({
                    'role': msg['role'], 
                    'content': msg['content']
                })
            else:
                print(f"Warning: Skipping malformed message: {msg}")
        
        # print("Processed conversation:", conversation_only)
        
        # Call your MockInterviewAgent with cleaned data
        result = mock_interview_agent.evaluate_interview(resume_text, conversation_only)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

from bson import ObjectId

def get_candidate_info(candidate_id):
    try:
        candidate = db["candidates"].find_one({"_id": ObjectId(candidate_id)}, {"_id": 0})
        if not candidate:
            return jsonify({"error": "Candidate not found"}), 404
        return jsonify(candidate), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
