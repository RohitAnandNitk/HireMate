from datetime import datetime, timedelta
from src.Utils.Database import db

class InterviewSchedulingAgent:
    def __init__(self, email_service):
        """
        email_service: instance of your EmailingAgent or email utility class
        """
        self.email_service = email_service

    def schedule_interviews(self, shortlisted_candidates, interview_datetime=None, meeting_link=None):
        """
        shortlisted_candidates: list of dicts -> [{'name': 'John Doe', 'email': 'john@example.com'}, ...]
        interview_datetime: datetime object for interview (default: tomorrow 10 AM)
        meeting_link: base link to the interview (default: Google Meet link)
        """
        
        if interview_datetime is None:
            interview_datetime = datetime.now() + timedelta(days=1)
            interview_datetime = interview_datetime.replace(hour=10, minute=0, second=0, microsecond=0)

        if meeting_link is None:
            meeting_link = "https://hirekruit.vercel.app/interview_start"

        for candidate in shortlisted_candidates:
            # Fetch candidate record from the database using email
            candidate_record = db.candidates.find_one({"email": candidate['email']})
            
            if not candidate_record:
                print(f"⚠️ Candidate with email {candidate['email']} not found in database.")
                continue
            
            candidate_id = str(candidate_record['_id'])  # Convert ObjectId to string
            
            # Construct the interview link with the candidate's unique ID
            interview_url = f"{meeting_link}/{candidate_id}"

            subject = "Interview Invitation - HireMate"
            
            body = f"Dear {candidate['name']},\n\n" \
                "Congratulations! You have been shortlisted for the next stage of our recruitment process.\n\n" \
                "We would like to invite you to an interview scheduled as follows:\n\n" \
                f"📅 Date: {interview_datetime.strftime('%A, %d %B %Y')}\n" \
                f"⏰ Time: {interview_datetime.strftime('%I:%M %p')}\n" \
                f"🔗 Interview Link: {interview_url}\n\n" \
                "Please be available at the scheduled time.\n" \
                "Wishing you the best of luck!\n\n" \
                "Best regards,\n" \
                "HR Team"

            # Send the email using the email service
            self.email_service.send_email(candidate['email'], subject, body)

        print(f"Interview emails sent to {len(shortlisted_candidates)} candidates.")

