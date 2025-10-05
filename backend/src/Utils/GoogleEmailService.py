import os
import base64
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
from google.auth.transport.requests import Request


SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

class EmailService:
    def __init__(self, token_path="token.json", credentials_path="credentials.json"):
        self.token_path = token_path
        self.credentials_path = credentials_path
        self.creds = None
        self.service = None
        self.authenticate()
        print("Gmail API EmailService initialized!")

    def authenticate(self):
        # Load token if exists
        if os.path.exists(self.token_path):
            self.creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)

        # If no valid credentials, login via OAuth
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, SCOPES
                )
                self.creds = flow.run_local_server(port=0)
            # Save token for future use
            with open(self.token_path, "w") as token_file:
                token_file.write(self.creds.to_json())

        # Build Gmail API service
        self.service = build("gmail", "v1", credentials=self.creds)

    def send_email(self, to_email: str, subject: str, body: str):
        """Send email via Gmail API"""
        print("GoogleEmailService: Preparing to send email...")
        try:
            message = MIMEText(body)
            message["to"] = to_email
            message["from"] = self.creds.client_id  # optional, can be your Gmail
            message["subject"] = subject

            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
            send_message = {"raw": raw_message}

            sent = self.service.users().messages().send(userId="me", body=send_message).execute()
            print(f"✓ Email sent successfully to {to_email}, id: {sent['id']}")
            return True

        except Exception as e:
            print(f"✗ Failed to send email: {e}")
            import traceback
            traceback.print_exc()
            raise
