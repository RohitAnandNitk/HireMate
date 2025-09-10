import json
from datetime import datetime
from src.LLM.Groq import GroqLLM
from src.Prompts.PromptBuilder import PromptBuilder
from src.Utils.Database import db  # Import the database

groq = GroqLLM()

class ResumeShortlistingAgent:
    def __init__(self):
        self.prompt_builder = PromptBuilder()
        self.llm = groq.get_model()

    def shortlist_candidates(self, candidates, keywords, job_role):
        """
        Takes extracted candidate info, keywords list, and job role.
        Returns shortlisted and not_shortlisted lists.
        Also updates the shortlist status in the database.
        """
        print("ShortlistingAgent called")
        shortlisted = []
        not_shortlisted = []

        system_prompt = f"""
        You are an intelligent Resume Screening Agent.

        Job Role: {job_role}
        Required Skills/Keywords: {keywords}

        You will receive:
        1. The candidate's resume text.

        Your task:
        - Assess how well the candidate fits the {job_role} role, even if skill names or job titles are worded differently.
        - Recognize synonyms, related tools, frameworks, and transferable skills.
        - Give more weight to core role-specific skills and relevant work experience than to exact keyword matches.
        - Account for abbreviations, alternative names, and related technologies.
        - Consider potential to learn quickly if experience is similar but not exact.
        - Check that the resume includes at least 2 projects.

        Scoring:
        1. Assign a match score between 0 and 100 based on overall fit.
        2. Shortlist a candidate only if:
           - The score is 75 or above, AND
           - The resume contains at least 2 distinct projects.
        3. Otherwise, mark them as not shortlisted.

        Output format:
        Do not return any explanations or additional text.
        **Must** return ONLY a valid JSON object:
        {{
            "shortlisted": "yes" or "no"
        }}

        """

        for candidate in candidates:
            human_prompt = (
                f"Here is the candidate's resume content:\n{candidate['resume_content']}\n\n"
                "Based on this resume, determine if the candidate is a suitable match for the job role and required skills."
            )

            messages = self.prompt_builder.build(system_prompt, human_prompt)
            response = self.llm.invoke(messages)

            try:
                llm_output = json.loads(response.content.strip())
                # print("Shortlisting Agent:", llm_output)
            except json.JSONDecodeError:
                print(f"Invalid JSON for {candidate.get('resume', 'unknown')}:\n", response.content)
                continue

            shortlist_status = llm_output.get("shortlisted", "").lower()
            result = {
                "resume": candidate.get("resume", ""),
                "name": candidate.get("name", ""),
                "email": candidate.get("email", "")
            }

            # Update the shortlist status in the database
            db.candidates.update_one(
                {"email": candidate.get("email")},
                {"$set": {
                    "resume_shortlisted": "yes" if shortlist_status == "yes" else "no",
                    "updated_at": datetime.utcnow()
                }}
            )

            if shortlist_status == "yes":
                shortlisted.append(result)
            else:
                not_shortlisted.append(result)

        print("shortlisted", len(shortlisted))
        print("not_shortlisted", len(not_shortlisted))

        return {
            "shortlisted": shortlisted,
            "not_shortlisted": not_shortlisted
        }
