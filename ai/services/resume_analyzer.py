from utils.helpers import analyze_with_prompt


def analyze_resume(pdf_path: str):
    return analyze_with_prompt(pdf_path, "resume_prompt.txt")