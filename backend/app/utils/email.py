import smtplib
from email.mime.text import MIMEText

from app.config.settings import settings


def send_otp_email(to_email: str, otp_code: str) -> None:
    if not settings.SMTP_EMAIL or not settings.SMTP_APP_PASSWORD:
        print(f"[DEV] Password reset OTP for {to_email}: {otp_code}")
        return

    body = (
        f"Your OralSense AI password reset code is: {otp_code}\n\n"
        f"This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n\n"
        "If you did not request this, please ignore this email."
    )
    msg = MIMEText(body)
    msg["Subject"] = "OralSense AI - Password Reset Code"
    msg["From"] = settings.SMTP_EMAIL
    msg["To"] = to_email

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_APP_PASSWORD)
        server.send_message(msg)
