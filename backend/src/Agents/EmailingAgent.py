from backend.src.Utils.EmailService import EmailService

email_service = EmailService()
send_email = email_service.send_email


class EmailingAgent:
    def __init__(self, smtp_server, smtp_port, email_user, email_password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.email_user = email_user
        self.email_password = email_password

    def create_email_templates(self):
        return {
            "shortlisted": "Dear {name},\n\nCongratulations! You have been shortlisted...",
            "not_shortlisted": "Dear {name},\n\nThank you for applying. Unfortunately..."
        }

    def process_and_send(self, shortlisted, not_shortlisted):
        templates = self.create_email_templates()

        for person in shortlisted:
            body = templates["shortlisted"].format(name=person["name"])
            self.send_email(person["email"], "Shortlist Notification", body)

        for person in not_shortlisted:
            body = templates["not_shortlisted"].format(name=person["name"])
            self.send_email(person["email"], "Application Status", body)
