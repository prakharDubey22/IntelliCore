from utils.helpers import analyze_with_prompt


def analyze_skill_gap(pdf_path: str):
    return analyze_with_prompt(pdf_path, "skill_gap_prompt.txt")