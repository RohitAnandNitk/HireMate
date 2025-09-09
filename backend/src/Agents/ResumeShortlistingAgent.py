import json
from backend.src.LLM.Groq import GroqLLM
from backend.src.Prompts.PromptBuilder import PromptBuilder

groq = GroqLLM()

class ResumeShortlistingAgent:
    def __init__(self):
        self.prompt_builder = PromptBuilder()
        self.llm = groq.get_model()

    def shortlist_candidates(self, candidates, keywords):
        """
        Takes extracted candidate info + keywords.
        Returns shortlisted and not_shortlisted lists.
        """
        shortlisted = []
        not_shortlisted = []

        system_prompt = """
        You are an intelligent Resume Screening Agent.
        You will receive:
        1. The job role and required skills (keywords).
        2. A candidate's resume text.

        Your task:
        - Assess how well the candidate fits the role, even if skill names or job titles are worded differently.
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
        **Must** return ONLY a valid JSON object:
        {
            "shortlisted": "yes" or "no"
        }
        """

        for candidate in candidates:
            human_prompt = (
                f"Here is the candidate's resume content: {candidate['resume_content']}. "
                f"The required keywords/role requirements are: {keywords}. "
                "Based on this information, determine if the candidate is a suitable match."
            )

            messages = self.prompt_builder.build(system_prompt, human_prompt)
            response = self.llm.invoke(messages)

            try:
                llm_output = json.loads(response.content.strip())
                print("Shortlisting Agent:", llm_output)
            except json.JSONDecodeError:
                print(f"Invalid JSON for {candidate['resume']}:\n", response.content)
                continue

            result = {
                "resume": candidate["resume"],
                "name": candidate["name"],
                "email": candidate["email"]
            }

            if llm_output.get("shortlisted", "").lower() == "yes":
                shortlisted.append(result)
            else:
                not_shortlisted.append(result)

        return {"shortlisted": shortlisted, "not_shortlisted": not_shortlisted}
