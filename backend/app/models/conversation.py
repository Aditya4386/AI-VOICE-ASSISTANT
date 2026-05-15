from sqlalchemy import Column, Integer, String

from app.database.database import Base

class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    user_id = Column(Integer)