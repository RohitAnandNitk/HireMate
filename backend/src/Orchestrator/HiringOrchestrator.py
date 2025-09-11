# src/Orchestrators/HiringOrchestrator.py
import os
from src.Agents.ResumeIntakeAgent import ResumeIntakeAgent
from src.Agents.ResumeShortlistingAgent import ResumeShortlistingAgent
from src.Agents.EmailingAgent import EmailingAgent
from src.Agents.InterviewSchedulingAgent import InterviewSchedulingAgent
from src.Utils.EmailService import EmailService

from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")



def hiringOrchestrator(file_paths, keywords, job_role):
    print("Starting hiring orchestrator")

    # ResumeIntakeAgent processes resumes and extracts candidate information
    resume_agent = ResumeIntakeAgent()
    candidates = resume_agent.process_resumes(file_paths)

    # ResumeShortlistingAgent shortlists candidates based on keywords and job role
    shortlisting_agent = ResumeShortlistingAgent()
    shortlist_result  = shortlisting_agent.shortlist_candidates(candidates, keywords, job_role)

    #creating the email service instance
    email_service = EmailService(SMTP_SERVER, SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD)
    # EmailingAgent sends emails to shortlisted and not-shortlisted candidates
    emailing_agent = EmailingAgent(email_service)
    emailing_agent.process_and_send(shortlist_result["shortlisted"], shortlist_result["not_shortlisted"])

    # Scheduling interviews for shortlisted candidates
    interview_scheduling_agent = InterviewSchedulingAgent(email_service)
    interview_scheduling_agent.schedule_interviews(shortlist_result["shortlisted"])

    return {
        "message": "Resumes processed, shortlisted successfully, emails sent, and interviews scheduled.",
        "shortlist_result": shortlist_result["shortlisted"],
        "not_shortlisted": shortlist_result["not_shortlisted"]
    }
