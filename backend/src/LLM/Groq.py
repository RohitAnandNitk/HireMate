import os
from dotenv import load_dotenv
from .Base import BaseLLM
from langchain_groq import ChatGroq  # Assuming langchain-groq is installed

# Load environment variables from .env
load_dotenv()

class GroqLLM(BaseLLM):
    def __init__(self, model_name: str = "llama-3.3-70b-versatile"):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        super().__init__(model_name)
        self.api_key = api_key

    def get_model(self):
        return ChatGroq(
            api_key=self.api_key,
            model_name=self.model_name,
            temperature=0
        )
