import os
import random

from dotenv import load_dotenv

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

load_dotenv()

conf = ConnectionConfig(

    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),

    MAIL_FROM=os.getenv("MAIL_FROM"),

    MAIL_PORT=int(os.getenv("MAIL_PORT")),

    MAIL_SERVER=os.getenv("MAIL_SERVER"),

    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,

    USE_CREDENTIALS=True,

    VALIDATE_CERTS=True
)

def generate_otp():

    return str(random.randint(100000, 999999))

async def send_otp_email(email: str, otp: str):

    html = f"""
    <h2>AI Voice Assistant OTP Verification</h2>

    <p>Your OTP is:</p>

    <h1>{otp}</h1>

    <p>This OTP expires in 5 minutes.</p>
    """

    message = MessageSchema(

        subject="Your OTP Code",

        recipients=[email],

        body=html,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)