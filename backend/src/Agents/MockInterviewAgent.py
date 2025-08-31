import os
import uuid
import whisper
from gtts import gTTS  # optional if you want TTS

####
from src.LLM.Groq import GroqLLM 
groq = GroqLLM()
llm = groq.get_model()

class MockInterviewAgent:
    def __init__(self):
        self.stt_model = whisper.load_model("tiny")  # faster for live feel
        self.tts_dir = os.path.join(os.getcwd(), "static", "tts")
        os.makedirs(self.tts_dir, exist_ok=True)

    def transcribe_file(self, path: str) -> str:
        result = self.stt_model.transcribe(path)
        return (result.get("text") or "").strip()

    def generate_response(self, candidate_text: str) -> str:
        response = llm.invoke(candidate_text)
        return response.content if hasattr(response, "content") else str(response)

    def tts(self, text: str):
        """Optional TTS; returns public URL (or None if you skip TTS)."""
        filename = f"{uuid.uuid4().hex}.mp3"
        out_path = os.path.join(self.tts_dir, filename)
        try:
            tts = gTTS(text=text, lang="en")
            tts.save(out_path)
            return f"http://localhost:5000/static/tts/{filename}"
        except Exception as e:
            print("TTS error:", e)
            return None

    # For REST (kept for compatibility)
    def process(self, file_storage):
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            file_storage.save(tmp.name)
            return self.process_file(tmp.name)

    # For WebSocket live (file path)
    def process_file(self, path: str):
        print("🔊 Processing utterance...")
        user_text = self.transcribe_file(path)
        print("User said:", user_text or "[empty]")

        if not user_text:
            return {"reply": "I didn't catch that—could you repeat?"}

        reply = self.generate_response(user_text)
        audio_url = self.tts(reply)  # comment out if you want text-only first
        return {"reply": reply, "audio_url": audio_url}
