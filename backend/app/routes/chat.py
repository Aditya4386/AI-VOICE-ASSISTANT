from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.conversation import Conversation
from app.models.message import Message

from app.services.ai_service import generate_ai_response

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


class ConversationCreate(BaseModel):

    title: str

    user_id: int


@router.post("/conversations")
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db)
):

    conversation = Conversation(
        title=data.title,
        user_id=data.user_id
    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return {
        "conversation_id": conversation.id
    }


@router.get("/conversations/{user_id}")
def get_conversations(
    user_id: int,
    db: Session = Depends(get_db)
):

    conversations = db.query(
        Conversation
    ).filter(
        Conversation.user_id == user_id
    ).all()

    return conversations


@router.get("/messages/{conversation_id}")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    messages = db.query(
        Message
    ).filter(
        Message.conversation_id == conversation_id
    ).all()

    return messages


class ChatRequest(BaseModel):

    conversation_id: int

    message: str


@router.post("/chat-message")
def chat_message(
    data: ChatRequest,
    db: Session = Depends(get_db)
):

    user_message = Message(
        conversation_id=data.conversation_id,
        role="user",
        content=data.message
    )

    db.add(user_message)

    db.commit()

    previous_messages = db.query(Message).filter(
        Message.conversation_id == data.conversation_id
    ).all()

    formatted_messages = [

        {
            "role": msg.role,
            "content": msg.content
        }

        for msg in previous_messages

    ]

    ai_response = generate_ai_response(
        formatted_messages
    )

    ai_message = Message(
        conversation_id=data.conversation_id,
        role="assistant",
        content=ai_response
    )

    db.add(ai_message)

    db.commit()

    return {
        "response": ai_response
    }