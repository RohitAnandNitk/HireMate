import os
from typing import List
import fitz

from langchain.schema.messages import HumanMessage, SystemMessage
from LLM.Groq import GroqLLM  # your LLM config loader
get_llm = GroqLLM.get_model()
from Prompts.PromptBuilder import PromptBuilder  # your prompt builder


class ResumeIntakeAgent:
    def __init__(self, system_prompt: str, human_prompt: str):
        self.prompt_builder = PromptBuilder(system_prompt, human_prompt)
        self.llm = get_llm()  # returns your configured LLM

    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
        return text.strip()

    def process_resumes(self, pdf_files: List[str]) -> dict:
        shortlisted = []
        not_shortlisted = []

        for pdf_path in pdf_files:
            resume_text = self.extract_text_from_pdf(pdf_path)

            # Build prompt messages
            messages = self.prompt_builder.build(
                resume_text=resume_text
            )

            # Call LLM
            response = self.llm.invoke(messages)
            result = response.content.strip().lower()

            # Classify
            if "yes" in result:
                shortlisted.append(pdf_path)
            else:
                not_shortlisted.append(pdf_path)

        return {
            "shortlisted": shortlisted,
            "not_shortlisted": not_shortlisted
        }
