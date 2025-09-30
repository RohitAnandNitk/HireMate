import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        
        print(f"EmailService initialized:")
        print(f"  SMTP Server: {smtp_server}")
        print(f"  SMTP Port: {smtp_port}")
        print(f"  Username: {username}")
        print(f"  Password: {'*' * len(password) if password else 'None'}")

    def send_email(self, to_email: str, subject: str, body: str):
        """Send email with detailed error handling"""
        try:
            print(f"\n=== Sending Email ===")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print(f"Body length: {len(body)} chars")
            
            # Create message
            msg = MIMEMultipart()
            msg["Subject"] = subject
            msg["From"] = self.username
            msg["To"] = to_email
            msg.attach(MIMEText(body, "plain"))
            
            # Connect and send
            print(f"Connecting to {self.smtp_server}:{self.smtp_port}...")
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=30) as server:
                print("Connected! Starting TLS...")
                server.starttls()
                
                print("Logging in...")
                server.login(self.username, self.password)
                
                print("Sending email...")
                server.sendmail(self.username, to_email, msg.as_string())
                
                print(f"✓ Email sent successfully to {to_email}")
                
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            print(f"✗ Authentication failed: {e}")
            print("Check your EMAIL_USER and EMAIL_PASSWORD")
            raise
            
        except smtplib.SMTPException as e:
            print(f"✗ SMTP error: {e}")
            raise
            
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
            import traceback
            traceback.print_exc()
            raise