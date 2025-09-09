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

        print("✅ Email notifications sent.")

    # we will have a method to send the emails to final selected candidates
    def send_final_selection_emails(self, selected_candidates):
        templates = {
            "final_selection": (
                "Subject: Job Offer from {company_name}\n\n"
                "Dear {name},\n\n"
                "We are excited to extend to you an offer to join {company_name} as a valued member of our team. "
                "Congratulations on successfully completing the interview process!\n\n"
                "We believe your skills and experience will be a great fit for our organization, "
                "and we look forward to the contributions you will make.\n\n"
                "Please find attached the formal offer letter with details about your role, compensation, "
                "and other relevant information. We kindly ask you to review it and respond by {response_deadline}.\n\n"
                "If you have any questions or need further clarification, feel free to reach out to us.\n\n"
                "Once again, congratulations! We are eager to welcome you aboard.\n\n"
                "Best regards,\n"
                "{company_name} Recruitment Team"
            )
        }

        company_name = "HireMate"
        response_deadline = "MM/DD/YYYY"  # Placeholder for actual deadline

        for candidate in selected_candidates:
            body = templates["final_selection"].format(
                name=candidate["name"],
                company_name=company_name,
                response_deadline=response_deadline
            )
            self.email_service.send_email(candidate["email"], "Job Offer", body)

        print("✅ Final selection emails sent.")