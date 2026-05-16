from sqlalchemy import Column, Integer, String

from app.database.database import Base

class OTP(Base):

    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, nullable=False)

    otp = Column(String, nullable=False)