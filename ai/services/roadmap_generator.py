from utils.helpers import analyze_with_prompt


def generate_roadmap(pdf_path: str):
    return analyze_with_prompt(pdf_path, "roadmap_prompt.txt")