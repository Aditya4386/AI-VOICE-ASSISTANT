from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.models.conversation import Conversation
from app.models.message import Message
from app.routes.auth import router as auth_router
from app.database.database import Base, engine
from app.models.user import User
from app.models.otp import OTP
from app.routes import otp

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(otp.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "message": "Backend running"
    }