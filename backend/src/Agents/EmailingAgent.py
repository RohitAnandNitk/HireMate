import os

from bson import ObjectId
from src.Utils.EmailService import EmailService


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

        # here we will fetch the candidates from the database based on the drive_id
        from src.Utils.Database import db
        candidates = list(db.drive_candidates.find({"drive_id": drive_id}))

        for person in candidates:
            # here we first get info of candiddate then we need their email and name
            candidate_id = person["candidate_id"]
            candidate_info = db.candidates.find_one({"_id": ObjectId(candidate_id)})
            # print("Processing candidate:", candidate_info)
            if not candidate_info:
                print(f"Candidate info not found for ID: {person['candidate_id']}")
                continue

            if person["resume_shortlisted"] == "yes":
                body = templates["shortlisted"].format(name=candidate_info["name"], company_name=company_name)
                self.email_service.send_email(candidate_info["email"], "Shortlist Notification", body)
            elif person["resume_shortlisted"] == "no":
                body = templates["not_shortlisted"].format(name=candidate_info["name"], company_name=company_name)
                self.email_service.send_email(candidate_info["email"], "Application Status", body)

            # now we will update the email_sent status in drive_candidates collection
            db.drive_candidates.update_one(
                {"_id": person["_id"]},
                {"$set": {"email_sent": "yes"}}
            )


        print("Email notifications sent.")

    # we will have a method to send the emails to final selected candidates
    def send_final_decision_email(self,candidate, decision, feedback):
        company_name = "HiRekruit"
        job_role = "Software Engineer"
        if decision == "SELECT":
            subject = f"Congratulations! Job Offer from {company_name}"
            body = (
                f"Dear {candidate['name']},\n\n"
                f"Congratulations! You have been selected for the {job_role} position at {company_name}. "
                f"We are excited to have you on board and believe your skills will be a great asset to our team.\n\n"
                "Please check the attached offer letter for details about your role and next steps.\n\n"
                "Feel free to reach out with any questions.\n\n"
                f"Best regards,\n{company_name} Recruitment Team"
            )
        else:
            subject = f"Interview Outcome from {company_name}"
            body = (
                f"Dear {candidate['name']},\n\n"
                f"Thank you for participating in the interview process for the {job_role} role at {company_name}. "
                "After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\n"
                f"Feedback from the interview:\n{feedback}\n\n"
                "We appreciate the time and effort you invested in applying and encourage you to apply for future opportunities.\n\n"
                f"Best regards,\n{company_name} Recruitment Team"
            )

        # Send the email using the email service
        self.email_service.send_email(candidate["email"], subject, body)
        print(f"Decision email sent to {candidate['email']}")