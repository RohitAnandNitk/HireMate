import os
import json
import unicodedata
from typing import List
import fitz
from backend.src.LLM.Groq import GroqLLM 
from backend.src.Prompts.PromptBuilder import PromptBuilder

groq = GroqLLM()
get_llm = groq.get_model()

class ResumeIntakeAgent:
    def __init__(self):
        self.prompt_builder = PromptBuilder()
        self.llm = groq.get_model()

    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
        return text.strip()
    

    def process_resumes(self, pdf_files: List[str], keywords: List[str]) -> dict:
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
        - Check that the resume includes at least 2 projects. Projects may be listed under headings like "Projects", "Personal Projects", "Academic Projects", or similar.

        Scoring:
        1. Assign a match score between 0 and 100 based on overall fit.
        2. Shortlist a candidate only if:
        - The score is 75 or above, AND
        - The resume contains at least 2 distinct projects.
        3. Otherwise, mark them as not shortlisted.

        Must do proper Extraction of Name and Gmail/Email:
        - Extract the **full name** exactly as it appears in the resume (remove extra spaces, punctuation, or artifacts).
        - Extract the **email address** in **standard email format** (`local@domain`), without any spaces, extra characters, or prefixes.
        - If multiple emails are found, pick the one most likely to be the candidate's primary personal email.
        - Remove any extra characters before or after the email.
        - Validate the email against standard rules (must contain '@' and a valid domain).
        - There will be a character before the email address so don't include it(R username@gmail.com -> username@gmail.com).

        Output format:
        **Must** return ONLY a valid JSON object in the following format (no extra text, no explanation, no markdown):
        Do not wrap the JSON in ```json or any other formatting.
        {
        "name": "<Candidate Name>",
        "email": "<Candidate Email>",
        "shortlisted": "yes" or "no"
        }
        """



        for pdf_path in pdf_files:
            resume_content = self.extract_text_from_pdf(pdf_path)
            # print("Resume Content :", resume_content)

            human_prompt = (
                f"Here is the candidate's resume content: {resume_content}. "
                f"The required keywords/role requirements are: {keywords}. "
                "Based on this information, determine if the candidate is a suitable match."
            )

            messages = self.prompt_builder.build(system_prompt, human_prompt)
            response = self.llm.invoke(messages)


            try:
                llm_output = json.loads(response.content.strip())
                print("Resume Agent : ", llm_output)
            except json.JSONDecodeError:
                print(f"Invalid JSON from LLM for {pdf_path}:\n", response.content)
                continue

            if llm_output["shortlisted"].lower() == "yes":
                shortlisted.append({
                    "resume": pdf_path,
                    "name": llm_output["name"],
                    "email": llm_output["email"]
                })
            else:
                not_shortlisted.append({
                    "resume": pdf_path,
                    "name": llm_output["name"],
                    "email": llm_output["email"]
                })

        return {
            "shortlisted": shortlisted,
            "not_shortlisted": not_shortlisted
        }



# testing purpose
if __name__ == "__main__":
    pdfs = [
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\RahulKumar.pdf",
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\244CA024_-_Resume_1d492eaf5-d6e1-445c-b5d6-8ac47f78bcd5 - Kushagra Singh.pdf",
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\244ca029_Monika_patidar - Monika Patidar..pdf",
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\Abhishek    _244CA002 - ABHISHEK SISODIYA.pdf",
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\Amit_244CA004 - Amit Patidar.pdf",
        r"D:\2025\PROJECTS\HireMate\SampleData\Resumes\MCA\anand.pdf"
    ]
    keywords = ["Software Developer Role", "MERN", "C++", "HTML", "CSS", "JavaScript"]

    agent = ResumeIntakeAgent()
    results = agent.process_resumes(pdf_files=pdfs, keywords=keywords)

    # print("Shortlisted:", results["shortlisted"])
    # print("Not Shortlisted:", results["not_shortlisted"])
