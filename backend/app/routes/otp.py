from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.otp import OTP
from app.models.user import User

from app.core.security import hash_password

from app.services.email_service import (
    generate_otp,
    send_otp_email
)

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


class SendOTPData(BaseModel):

    username: str
    email: str
    password: str


class VerifyOTPData(BaseModel):

    username: str
    email: str
    password: str
    otp: str


@router.post("/send-otp")
async def send_otp(
    data: SendOTPData,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    generated_otp = generate_otp()

    existing_otp = db.query(OTP).filter(
        OTP.email == data.email
    ).first()

    if existing_otp:

        existing_otp.otp = generated_otp

    else:

        otp_entry = OTP(
            email=data.email,
            otp=generated_otp
        )

        db.add(otp_entry)

    db.commit()

    await send_otp_email(
        data.email,
        generated_otp
    )

    return {
        "message": "OTP sent successfully"
    }


@router.post("/verify-otp")
def verify_otp(
    data: VerifyOTPData,
    db: Session = Depends(get_db)
):

    otp_entry = db.query(OTP).filter(
        OTP.email == data.email
    ).first()

    if not otp_entry:

        raise HTTPException(
            status_code=400,
            detail="OTP not found"
        )

    if otp_entry.otp != data.otp:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    new_user = User(

        username=data.username,

        email=data.email,

        hashed_password=hash_password(
            data.password
        )
    )

    db.add(new_user)

    db.delete(otp_entry)

    db.commit()

    return {
        "message": "Account created successfully"
    }