import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Read API Key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Gemini API Key not found in .env file")

# Create client
client = genai.Client(api_key=api_key)


def generate_response(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return f"Error: {e}"