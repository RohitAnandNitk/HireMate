# src/Orchestrators/HiringOrchestrator.py

from src.Agents.ResumeIntakeAgent import ResumeIntakeAgent
from src.Agents.ResumeShortlistingAgent import ResumeShortlistingAgent
from src.Agents.EmailingAgent import EmailingAgent
from src.Agents.InterviewSchedulingAgent import InterviewSchedulingAgent

def hiringOrchestrator(file_paths, keywords, job_role):
    print("Starting hiring orchestrator")

    # ResumeIntakeAgent processes resumes and extracts candidate information
    resume_agent = ResumeIntakeAgent()
    candidates = resume_agent.process_resumes(file_paths)

    # ResumeShortlistingAgent shortlists candidates based on keywords and job role
    shortlisting_agent = ResumeShortlistingAgent()
    shortlist_result  = shortlisting_agent.shortlist_candidates(candidates, keywords, job_role)
    
    # EmailingAgent sends emails to shortlisted and not-shortlisted candidates
    emailing_agent = EmailingAgent()
    emailing_agent.send_emails(shortlist_result["shortlisted"])

    # print("Shortlisting completed", shortlist_result)

    return {
        "message": "Resumes processed and shortlisted successfully",
        "shortlist_result": shortlist_result["shortlisted"],
        "not_shortlisted": shortlist_result["not_shortlisted"]
    }
