from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import uvicorn

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email Configuration
EMAIL_USER = "githuvarghese97@gmail.com"
EMAIL_PASSWORD = "cufz zsmm hrcg wvqe"

app = FastAPI(title="Portfolio API", description="Backend API for Githu Varghese's portfolio website")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactForm(BaseModel):
    name: str
    email: str
    subject: str = "New Contact Form Submission"
    message: str


@app.post("/send-email")
async def send_email(form: ContactForm):
    # Validate required fields
    if not form.name.strip():
        return {"status": "error", "message": "Name is required"}
    if not form.email.strip():
        return {"status": "error", "message": "Email is required"}
    if not form.message.strip():
        return {"status": "error", "message": "Message is required"}

    if not EMAIL_PASSWORD:
        logger.error("Email password not set")
        return {"status": "error", "message": "Email password not configured."}

    # Build email
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_USER
    msg['Subject'] = f"Portfolio Contact: {form.subject}"

    body = f"""
    You received a new message from your portfolio website:

    Name: {form.name}
    Email: {form.email}

    Message:
    {form.message}
    """

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        server.quit()

        logger.info(f"Email sent successfully from {form.email}")
        return {"status": "success", "message": "Email sent successfully!"}

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication Error")
        return {"status": "error", "message": "Email authentication failed. Check credentials."}

    except smtplib.SMTPException as e:
        logger.error(f"SMTP Error: {e}")
        return {"status": "error", "message": "Failed to send email due to SMTP error."}

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}


@app.get("/test")
async def test():
    return {"status": "success", "message": "FastAPI is running!"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)