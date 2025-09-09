import fitz
import json
from src.LLM.Groq import GroqLLM
from src.Prompts.PromptBuilder import PromptBuilder

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
        Extracts name, email, and resume content using LLM for all resumes.
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
        Return ONLY valid JSON without any extra characters, text, explanation, or formatting.
        Do NOT include markdown, code blocks, or annotations like ```json```.
        Just output the JSON object, nothing else.
        Example : 
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
                llm_output["resume"] = pdf_path  # attach file reference if needed
                candidates.append(llm_output)
                print(f"Extracted Info ({pdf_path}):", llm_output)

            except json.JSONDecodeError:
                print(f"Invalid JSON from LLM for {pdf_path}:\n", response.content)
                continue

        return candidates
