# src/Orchestrators/HiringOrchestrator.py

from src.Agents.ResumeIntakeAgent import ResumeIntakeAgent
from src.Agents.ResumeShortlistingAgent import ResumeShortlistingAgent
from src.Agents.EmailingAgent import EmailingAgent
from src.Agents.InterviewSchedulingAgent import InterviewSchedulingAgent

def hiringOrchestrator(file_paths, keywords, job_role):
    print("Starting hiring orchestrator")
    resume_agent = ResumeIntakeAgent()
    candidates = resume_agent.process_resumes(file_paths)

    shortlisting_agent = ResumeShortlistingAgent()
    shortlist_result  = shortlisting_agent.shortlist_candidates(candidates, keywords, job_role)
    print("Shortlisting completed", shortlist_result)

    return {
        "message": "Resumes processed and shortlisted successfully",
        "shortlist_result": shortlist_result["shortlisted"],
        "not_shortlisted": shortlist_result["not_shortlisted"]
    }
