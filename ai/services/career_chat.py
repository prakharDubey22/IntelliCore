from pathlib import Path

from services.gemini_service import generate_response
from utils.pdf_reader import extract_text_from_pdf


def get_career_guidance(pdf_path: str, question: str):

    resume_text = extract_text_from_pdf(pdf_path)

    prompt_path = (
        Path(__file__).parent.parent
        / "prompts"
        / "career_chat_prompt.txt"
    )

    with open(prompt_path, "r", encoding="utf-8") as file:
        prompt = file.read()

    final_prompt = (
        f"{prompt}\n\n"
        f"Student Resume:\n{resume_text}\n\n"
        f"User Question:\n{question}"
    )

    return generate_response(final_prompt)