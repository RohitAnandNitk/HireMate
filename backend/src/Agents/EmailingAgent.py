from backend.src.Utils.EmailService import EmailService

# email_service = EmailService()
# send_email = email_service.send_email


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

