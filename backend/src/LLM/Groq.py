from .Base import BaseLLM
from langchain_groq import ChatGroq  # Assuming langchain-groq is installed

class GroqLLM(BaseLLM):
    def __init__(self, api_key: str, model_name: str = "mixtral-8x7b-32768"):
        super().__init__(model_name)
        self.api_key = api_key

    def get_model(self):
        return ChatGroq(
            api_key=self.api_key,
            model_name=self.model_name,
            temperature=0
        )
