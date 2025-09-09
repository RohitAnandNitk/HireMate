import fitz
import json
from backend.src.LLM.Groq import GroqLLM
from backend.src.Prompts.PromptBuilder import PromptBuilder

groq = GroqLLM()

class ResumeIntakeAgent:
    def __init__(self):
        self.prompt_builder = PromptBuilder()
        self.llm = groq.get_model()

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract raw text from a PDF resume."""
        text = ""
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
        return text.strip()

    def process_resumes(self, pdf_files):
        """
        Extracts name, email, and resume content using LLM.
        Returns a list of candidate dictionaries.
        """
        candidates = []

        system_prompt = """
        You are a Resume Information Extraction Agent.
        Your task is to carefully extract structured candidate details
        from raw resume text.

        Extraction Rules:
        - Extract the **full candidate name** exactly as written in the resume header or first lines.
        - Extract the **primary email address** in valid format (local@domain).
          * Ignore prefixes/symbols around emails (like 'R username@gmail.com' -> 'username@gmail.com').
          * If multiple emails, choose the personal Gmail/Outlook one.
        - Keep the **full resume content** as a plain text string (no formatting).
        
        Output format:
        Return ONLY valid JSON without extra text:
        {
          "name": "<Candidate Name>",
          "email": "<Candidate Email>",
          "resume_content": "<Full Resume Content>"
        }
        """

        for pdf_path in pdf_files:
            raw_text = self.extract_text_from_pdf(pdf_path)

            human_prompt = f"""
            Extract candidate information from the following resume text:

            {raw_text}
            """

            messages = self.prompt_builder.build(system_prompt, human_prompt)
            response = self.llm.invoke(messages)

            try:
                llm_output = json.loads(response.content.strip())
                llm_output["resume"] = pdf_path  # keep file reference
                candidates.append(llm_output)
                print(f"Extracted Info ({pdf_path}):", llm_output)

            except json.JSONDecodeError:
                print(f"❌ Invalid JSON from LLM for {pdf_path}:\n", response.content)
                continue

<<<<<<< HEAD
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
        r"D:\New folder (3)\HireMate\Resumes\MCA\244CA024_-_Resume_1d492eaf5-d6e1-445c-b5d6-8ac47f78bcd5 - Kushagra Singh.pdf",
        r"D:\New folder (3)\HireMate\Resumes\MCA\244CA024_-_Resume_1d492eaf5-d6e1-445c-b5d6-8ac47f78bcd5 - Kushagra Singh.pdf",
        r"D:\New folder (3)\HireMate\Resumes\MCA\244ca029_Monika_patidar - Monika Patidar.pdf",
        r"D:\New folder (3)\HireMate\Resumes\MCA\Abhishek    _244CA002 - ABHISHEK SISODIYA.pdf",
        r"D:\New folder (3)\HireMate\Resumes\MCA\Amit_244CA004 - Amit Patidar.pdf",
        r"D:\New folder (3)\HireMate\Resumes\MCA\anand.pdf"
    ]
    keywords = ["Software Developer Role", "MERN", "C++", "HTML", "CSS", "JavaScript"]

    agent = ResumeIntakeAgent()
    results = agent.process_resumes(pdf_files=pdfs, keywords=keywords)

    # print("Shortlisted:", results["shortlisted"])
    # print("Not Shortlisted:", results["not_shortlisted"])
=======
        return candidates
>>>>>>> a75263be9ef9f499d356169ce7cc5ae910f44511
