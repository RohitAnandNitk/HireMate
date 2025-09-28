import os

from bson import ObjectId
from src.Utils.EmailService import EmailService
from src.Utils.Database import db

class EmailingAgent:    
    def __init__(self, email_service: EmailService):
        self.email_service = email_service

    def create_email_templates(self):
        return {
            "shortlisted": (
                "Subject: Congratulations on Your Resume Shortlisting!\n\n"
                "Dear {name},\n\n"
                "We are pleased to inform you that you have been shortlisted for the next stage "
                "of the selection process at {company_name}.\n\n"
                "Our recruitment team will be reaching out shortly with details about the next steps.\n"
                "Please keep an eye on your email for updates.\n\n"
                "Best regards,\n"
                "{company_name} Recruitment Team"
            ),
            
            "not_shortlisted": (
                "Subject: Application Update - {company_name}\n\n"
                "Dear {name},\n\n"
                "Thank you for your interest in joining {company_name}. "
                "After careful consideration, we regret to inform you that you have not been shortlisted "
                "for the next round at this time.\n\n"
                "We truly appreciate the effort you put into your application and encourage you to apply "
                "for future openings with us.\n\n"
                "Wishing you the best in your career journey.\n\n"
                "Best regards,\n"
                "{company_name} Recruitment Team"
            )
        }


    def send_mail_to_all_candidates(self, drive_id):
        templates = self.create_email_templates()

        company_name = "HiRekruit"

        # Get all candidates for this drive
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))

        # Extract all candidate IDs
        candidate_ids = [ObjectId(person["candidate_id"]) for person in candidates]

        # Fetch all candidate info in one query
        candidate_info_map = {
            str(c["_id"]): c
            for c in db.candidates.find({"_id": {"$in": candidate_ids}})
        }

        for person in candidates:
            candidate_id = person["candidate_id"]
            candidate_info = candidate_info_map.get(candidate_id)

            if not candidate_info:
                print(f"Candidate info not found for ID: {candidate_id}")
                continue

            # Prepare email
            if person["resume_shortlisted"] == "yes":
                body = templates["shortlisted"].format(
                    name=candidate_info["name"], company_name=company_name
                )
                self.email_service.send_email(
                    candidate_info["email"], "Shortlist Notification", body
                )
            elif person["resume_shortlisted"] == "no":
                body = templates["not_shortlisted"].format(
                    name=candidate_info["name"], company_name=company_name
                )
                self.email_service.send_email(
                    candidate_info["email"], "Application Status", body
                )

            # Update email_sent status
            db.drive_candidates.update_one(
                {"_id": person["_id"]},
                {"$set": {"email_sent": "yes"}}
            )

        print("Email notifications sent.")

 

    def send_final_selection_emails(self, drive_id):
        company_name = "HiRekruit"
        
        # Fetch job role
        job_role = db.drives.find_one({"_id": ObjectId(drive_id)}, {"role": 1}).get("role", "the position")
        
        # Fetch all candidates associated with this drive_id who have completed the interview
        candidates = list(db.drive_candidates.find({"drive_id": drive_id, "interview_completed": "yes"}))
        
        # Get all candidate IDs
        candidate_ids = [ObjectId(c["candidate_id"]) for c in candidates]
        
        # Fetch all candidate info in one query
        candidate_info_map = {str(c["_id"]): c for c in db.candidates.find({"_id": {"$in": candidate_ids}})}
        
        for person in candidates:
            candidate_info = candidate_info_map.get(person["candidate_id"])
            if not candidate_info:
                print(f"Candidate info not found for ID: {person['candidate_id']}")
                continue
            
            decision = person.get("selected", "REJECT")
            feedback = person.get("feedback", "No feedback provided.")
            
            # Prepare email content
            if decision.lower() == "yes":
                subject = f"Congratulations! Job Offer from {company_name}"
                body = (
                    f"Dear {candidate_info['name']},\n\n"
                    f"Congratulations! You have been selected for the {job_role} position at {company_name}. "
                    "Please check the attached offer letter for details.\n\n"
                    "Feel free to reach out with any questions.\n\n"
                    f"Best regards,\n{company_name} Recruitment Team"
                )
            else:
                subject = f"Interview Outcome from {company_name}"
                body = (
                    f"Dear {candidate_info['name']},\n\n"
                    f"Thank you for participating in the interview process for the {job_role} role at {company_name}. "
                    "After careful consideration, we regret to inform you that we will not be moving forward at this time.\n\n"
                    f"Feedback from the interview:\n{feedback}\n\n"
                    "We encourage you to apply for future opportunities.\n\n"
                    f"Best regards,\n{company_name} Recruitment Team"
                )
            
            # Send email
            self.email_service.send_email(candidate_info["email"], subject, body)
            
            # Update final email status in one call
            db.drive_candidates.update_one(
                {"_id": person["_id"]},
                {"$set": {"final_selection_email_sent": "yes", "final_email_sent": "yes"}}
            )
            print(f"Decision email sent to {candidate_info['email']}")
        
        print("All final selection emails sent.")
