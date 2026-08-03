from pathlib import Path

from services.gemini_service import generate_response
from utils.pdf_reader import extract_text_from_pdf


def analyze_with_prompt(pdf_path: str, prompt_file_name: str):

    # Extract text from resume
    resume_text = extract_text_from_pdf(pdf_path)

    # Read prompt file
    prompt_path = (
        Path(__file__).parent.parent / "prompts" / prompt_file_name
    )

    with open(prompt_path, "r", encoding="utf-8") as file:
        prompt = file.read()

    # Create final prompt
    final_prompt = f"{prompt}\n\n{resume_text}"

    # Send to Gemini
    return generate_response(final_prompt)