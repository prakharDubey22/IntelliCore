from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent

import os
from huggingface_hub import hf_hub_download

MODEL_REPO = "david8989/intellicore-model"
HF_TOKEN = os.getenv("HF_TOKEN")

model_path = hf_hub_download(
    repo_id=MODEL_REPO,
    filename="random_forest_model_small.pkl",
    token=HF_TOKEN,
)

preprocessor_path = hf_hub_download(
    repo_id=MODEL_REPO,
    filename="preprocessor_small.pkl",
    token=HF_TOKEN,
)

model = joblib.load(model_path)
preprocessor = joblib.load(preprocessor_path)
app = FastAPI(title="IntelliCore ML Service")
KNOWN = {}
for _name, _trans, _cols in preprocessor.transformers_:
    if hasattr(_trans, "categories_"):
        for _c, _cats in zip(_cols, _trans.categories_):
            KNOWN[_c] = [str(x) for x in _cats]

FALLBACKS = {
    "preferred_role": "Software Developer",
    "branch": "Other",
    "degree": "BTech",
}

ROLE_ALIASES = {
    "Backend Developer": "Software Developer",
    "Frontend Developer": "Software Developer",
    "Full Stack Developer": "Software Developer",
}

BRANCH_ALIASES = {
    "Computer Science": "CSE",
    "Computer Science Engineering": "CSE",
    "Artificial Intelligence": "CS-AI",
    "AI": "CS-AI",
}


class StudentFeatures(BaseModel):
    cgpa: float
    backlogs: float
    attendance_pct: float
    coding_skill_score: float
    dsa_score: float
    core_cs_score: float
    aptitude_score: float
    communication_score: float
    english_score: float
    projects_count: float
    internships_count: float
    certifications_count: float
    coding_hours_per_week: float
    interview_practice_hours_per_week: float
    resume_score: float
    mock_interview_score: float
    degree: str
    branch: str
    preferred_role: str


@app.get("/health")
def health():
    return {"status": "ok", "classes": [str(c) for c in model.classes_]}


@app.post("/predict")
def predict(student: StudentFeatures):
    data = student.model_dump()
    mapped = {}
    data["preferred_role"] = ROLE_ALIASES.get(data["preferred_role"], data["preferred_role"])
    data["branch"] = BRANCH_ALIASES.get(data["branch"], data["branch"])
    for col, fallback in FALLBACKS.items():
        allowed = KNOWN.get(col)
        if allowed and data[col] not in allowed:
            mapped[col] = {"sent": data[col], "usedInstead": allowed[0] if fallback not in allowed else fallback}
            data[col] = allowed[0] if fallback not in allowed else fallback
    df = pd.DataFrame([data])

    encoded = preprocessor.transform(df)
    probs = model.predict_proba(encoded)[0]

    classes = [str(c) for c in model.classes_]
    probabilities = {c: float(p) for c, p in zip(classes, probs)}
    predicted_class = classes[int(probs.argmax())]

    return {
        "predictedClass": predicted_class,
        "placementReadyProbability": probabilities.get("Placement Ready", 0.0),
        "probabilities": probabilities,
        "usedInputs": data,
    }