from langchain.prompts import ChatPromptTemplate
from langchain.schema.messages import SystemMessage, HumanMessage

from langchain.schema.messages import HumanMessage, SystemMessage

class PromptBuilder:
    def build(self, system_message: str, human_message: str):
        system_message = SystemMessage(content=system_message)
        human_message = HumanMessage(content=human_message)
        return [system_message, human_message]

