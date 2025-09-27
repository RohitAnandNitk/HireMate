from datetime import datetime, timedelta
from src.Utils.Database import db
from bson import ObjectId
from src.Utils.Database import db

class InterviewSchedulingAgent:
    def __init__(self, email_service):
        """
        email_service: instance of your EmailingAgent or email utility class
        """
        self.email_service = email_service

    def schedule_interviews(self, drive_id):
        """
        shortlisted_candidates: list of dicts -> [{'name': 'John Doe', 'email': 'john@example.com'}, ...]
        interview_datetime: datetime object for interview (default: tomorrow 10 AM)
        meeting_link: base link to the interview (default: Google Meet link)
        """

        # For simplicity, scheduling all interviews for tomorrow at 10 AM
        interview_datetime = datetime.now() + timedelta(days=1)
        interview_datetime = interview_datetime.replace(hour=10, minute=0, second=0, microsecond=0)

        # Base meeting link
        # meeting_link = "https://hirekruit.com/start-interview"
        meeting_link = "http://localhost:5173/start-interview"

        # Fetch shortlisted candidates from the database based on drive_id
        shortlisted_candidates = list(db.drive_candidates.find({
            "drive_id": drive_id,
            "resume_shortlisted": "yes"
        }))

        for candidate in shortlisted_candidates:
            #get candidate id from the drive candidate and candidate info from candidate collection
            candidate_id = candidate["candidate_id"]
            candidate_info = db.candidates.find_one({"_id": ObjectId(candidate_id)})


            # Check if candidate_info is valid
            if not candidate_info:
                print(f"⚠️ Candidate info with candidate {candidate_id} not found in database.")
                continue


            # Construct the interview link with the candidate's unique ID
            interview_url = f"{meeting_link}/{candidate['_id']}"

            subject = "Interview Invitation - HiRekruit"
            
            body = f"Dear {candidate_info['name']},\n\n" \
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
            print(f"Sending interview email to {candidate_info['email']}...")
            self.email_service.send_email(candidate_info['email'], subject, body)

            #update the interview_scheduled status in drive_candidates collection
            db.drive_candidates.update_one(
                {"_id": candidate["_id"]},
                {"$set": {"interview_scheduled": "yes", "updated_at": datetime.utcnow()}}
            )

        print(f"Interview emails sent to {len(shortlisted_candidates)} candidates.")

