from src.LLM.Groq import GroqLLM 
from src.Prompts.PromptBuilder import PromptBuilder
import json

groq = GroqLLM()
llm = groq.get_model()



class MockInterviewAgent:

    def evaluate_interview(self, resume_text, transcript):
        print("Evaluating interview MockInterview agent ...")
        
        # System role: instructions + expected format
        system_message = """
        You are an expert HR evaluator. 
        Your job is to evaluate the candidate based on their resume and the interview transcript. 

        ⚠️ IMPORTANT: 
        - Always return ONLY valid JSON.
        - Do NOT add explanations outside JSON.
        - Use this format:
        {
          "decision": "SELECT" or "REJECT",
          "feedback": "detailed constructive feedback"
        }
        """

        # Human role: candidate data
        human_message = f"""
        Resume:
        {resume_text}

        Interview Transcript:
        {transcript}
        """

        # Build prompt with system + human message
        prompt = PromptBuilder.build(system_message, human_message)
        response = llm.invoke(prompt)

        # Safe JSON parsing
        try:
            result = json.loads(response.content.strip())
            print("Evaluation Result:", result)
        except Exception:
            result = {
                "decision": "REJECT",
                "strengths": [],
                "weaknesses": [],
                "feedback": "Could not parse structured output."
            }

        return result
