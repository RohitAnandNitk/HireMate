import asyncio
import io, json
from flask import jsonify, request
from src.Utils.VapiService import upload_resume, mock_interview
import pdfplumber

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
    print("Resume Text:", resume_text)
    print("\n")
    print("Transcript:", transcript)
    try:
        # Call your MockInterviewAgent directly
        result = mock_interview_agent.evaluate_interview(resume_text, transcript)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

