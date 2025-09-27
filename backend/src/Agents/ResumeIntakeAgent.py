import fitz
import json
from datetime import datetime
from src.LLM.Groq import GroqLLM
from src.Prompts.PromptBuilder import PromptBuilder
from src.Utils.Database import db
from src.Model.Candidate import create_candidate
from src.Model.DriveCandidate import create_drive_candidate

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

    def process_resumes(self, pdf_files,drive_id):
        """
        Extracts name, email, and resume content using LLM for all resumes,
        enriches with timestamps, and saves/upserts into the database.
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
            - Keep the **full resume content** as a plain text string with the following processing:
            * Remove any special or non-printable characters such as unusual symbols (for example: '↕', 'ï') that can cause issues in JSON encoding.
            * Keep standard punctuation, letters, numbers, and common formatting like newlines.
            * Ensure the text is clean and free from characters that can break JSON parsing.
            * Preserve the information but remove decorative or corrupted characters.

            Output format:
            Return ONLY **valid JSON** without any extra characters, text, explanation, or formatting.
            Do NOT include markdown, code blocks, or annotations like ```json```.
            Just output the JSON object, nothing else.

            Example : 
            {
            "name": "<Candidate Name>",
            "email": "<Candidate Email>",
            "resume_content": "<Cleaned Resume Content>"
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
                candidate_data = {
                    "name": llm_output["name"],
                    "email": llm_output["email"],
                    "resume_content": llm_output["resume_content"],
                    "updated_at": datetime.utcnow()
                }


                existing_candidate = db.candidates.find_one({"email": candidate_data["email"]})
                if existing_candidate:
                    candidate_data["created_at"] = existing_candidate["created_at"]
                else:
                    candidate_data["created_at"] = datetime.utcnow()

                db.candidates.update_one(
                    {"email": candidate_data["email"]},
                    {"$set": candidate_data},
                    upsert=True
                )
                
                # here first fetch the candidate id from db
                candidate_record = db.candidates.find_one({"email": candidate_data["email"]})
                candidate_data["candidate_id"] = str(candidate_record["_id"])

                #here we will now create a drivecandidate instance for this candidate and save teh driveid and other fields
                drive_candidate_data = create_drive_candidate(candidate_id=candidate_data["candidate_id"], drive_id=drive_id)
                db.drive_candidates.update_one(
                    {"candidate_id": candidate_data["candidate_id"], "drive_id": drive_id},
                    {"$set": drive_candidate_data},
                    upsert=True
                )

                candidates.append(candidate_data)
                # print(f"Processed Candidate ({pdf_path}):", candidate_data)

            except json.JSONDecodeError:
                print(f"Invalid JSON from LLM for {pdf_path}:\n", response.content)
                continue

        return candidates
