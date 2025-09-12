import os
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


    def process_and_send(self, shortlisted, not_shortlisted):
        templates = self.create_email_templates()

        company_name = "HireMate"

        for person in shortlisted:
            body = templates["shortlisted"].format(name=person["name"], company_name=company_name)
            self.email_service.send_email(person["email"], "Shortlist Notification", body)

        for person in not_shortlisted:
            body = templates["not_shortlisted"].format(name=person["name"], company_name=company_name)
            self.email_service.send_email(person["email"], "Application Status", body)

        print("Email notifications sent.")

    # we will have a method to send the emails to final selected candidates
    def send_final_decision_email(self,candidate, decision, feedback):
        company_name = "HireMate"
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