import os
# from vapi import Vapi

# VAPI_API_KEY = os.getenv("VAPI_API_KEY")

# Initialize Vapi client
# vapi = Vapi(token=VAPI_API_KEY)

# Store resumes temporarily per session
candidate_resumes = {}

# Define a helper to run a mock interview chat
# async def mock_interview(session_id: str, user_message: str):
#     """
#     Run a mock interview conversation with context from the candidate's resume.
#     """
#     resume_context = candidate_resumes.get(session_id, "")
    
#     # Build the prompt with context
#     prompt = f"""
#     You are a professional technical interviewer.
#     Use the candidate's resume context below to ask personalized questions.
#     Conduct the interview naturally, one question at a time.
#     Wait for the candidate to respond before asking the next question.
#     Cover technical, project, and behavioral aspects from the resume.

#     Resume Context:
#     {resume_context}

#     Candidate: {user_message}
#     Interviewer:
#     """

#     # Call Vapi chat
#     response = await vapi.chat(prompt)
#     return response["output_text"]

# Tool: uploadResume
async def upload_resume(session_id: str, resume_text: str):
    """
    Save candidate's resume context for later use.
    """
    print("at vapi service.....")
    print("session id : ", session_id)
    print("resume text : ", resume_text)
    candidate_resumes[session_id] = resume_text
    return {"success": True}
