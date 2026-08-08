from services.career_chat import get_career_guidance


result = get_career_guidance(
    "uploads/resume.pdf",
    "What should I focus on during the next 3 months to become placement ready?"
)

print(result)