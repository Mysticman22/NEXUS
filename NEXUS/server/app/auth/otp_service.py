import random
import smtplib
from app.core.config import settings

# In-memory storage for OTPs (Use Redis in production)
otp_storage = {}

def generate_otp(uid: str) -> str:
    """
    Generates a 6-digit code and stores it against the User ID.
    """
    code = str(random.randint(100000, 999999))
    otp_storage[uid] = code
    return code

def verify_otp_code(uid: str, code: str) -> bool:
    """
    Checks if the code matches the one stored for this User ID.
    """
    if uid in otp_storage and otp_storage[uid] == code:
        del otp_storage[uid]  # One-time use
        return True
    return False

def send_email_otp(email: str, code: str):
    """
    Sends the email. 
    Currently PRINTS to console for development safety.
    """
    # 1. Print to console (So you can log in during dev)
    print(f"\n[📧 MOCK EMAIL] To: {email}")
    print(f"[🔐 CODE] {code}\n")

    # 2. Real Email Logic (Uncomment when ready)
    # try:
    #     with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
    #         server.starttls()
    #         server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
    #         msg = f"Subject: NEXUS Login Code\n\nYour access code is: {code}"
    #         server.sendmail(settings.SMTP_USER, email, msg)
    # except Exception as e:
    #     print(f"Failed to send email: {e}")