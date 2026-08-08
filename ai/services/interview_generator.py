from utils.helpers import analyze_with_prompt


def generate_interview_questions(pdf_path: str):
    return analyze_with_prompt(pdf_path, "interview_prompt.txt")