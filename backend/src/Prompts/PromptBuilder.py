from langchain.prompts import ChatPromptTemplate
from langchain.schema.messages import SystemMessage, HumanMessage

from langchain.schema.messages import HumanMessage, SystemMessage

class PromptBuilder:
    def build(self, system_prompt: str, human_prompt: str):
        system_message = SystemMessage(content=system_prompt)
        human_message = HumanMessage(content=human_prompt)
        return [system_message, human_message]




# from prompt_builder import PromptBuilder
# # Create builder instance
# builder = PromptBuilder()

# # Build messages
# messages = builder.build(
#     "You are a helpful assistant that speaks politely.",
#     "Tell me a joke about computers."
# )