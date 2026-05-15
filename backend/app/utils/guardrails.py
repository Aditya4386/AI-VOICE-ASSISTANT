from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

blocked_words = [

    "bomb",
    "terrorist",
    "rape"

]

def keyword_block(message: str):

    lower_message = message.lower()

    for word in blocked_words:

        if word in lower_message:
            return False

    return True


def ai_moderation(message: str):

    moderation_prompt = f"""
    You are an AI safety moderator.

    Analyze the user message.

    If the message contains:
    - violence
    - illegal activity
    - hate speech
    - sexual abuse
    - self harm
    - dangerous instructions
    - hacking
    - harmful content

    respond ONLY with:
    UNSAFE

    Otherwise respond ONLY with:
    SAFE

    User message:
    {message}
    """

    completion = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "user",
                "content": moderation_prompt
            }
        ]

    )

    result = completion.choices[0].message.content.strip()

    return result == "SAFE"


def is_safe(message: str):

    if not keyword_block(message):
        return False

    if not ai_moderation(message):
        return False

    return True