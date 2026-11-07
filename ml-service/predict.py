#First we'll check that our saved .pkl files can correctly make a prediction for a new student.
import joblib
import pandas as pd

# Load the trained model
model = joblib.load("random_forest_model.pkl")

# Load the preprocessor
preprocessor = joblib.load("preprocessor.pkl")

print("Model and preprocessor loaded successfully!")

# Create one student's data
student_data = {
    "cgpa": 8.0,
    "backlogs": 0,
    "attendance_pct": 90,
    "coding_skill_score": 80,
    "dsa_score": 75,
    "core_cs_score": 78,
    "aptitude_score": 82,
    "communication_score": 80,
    "english_score": 85,
    "projects_count": 3,
    "internships_count": 1,
    "certifications_count": 2,
    "coding_hours_per_week": 15,
    "interview_practice_hours_per_week": 8,
    "resume_score": 80,
    "mock_interview_score": 78,
    "degree": "BTech",
    "branch": "CSE",
    "preferred_role": "Software Developer"
}

# Convert student data into DataFrame
student_df = pd.DataFrame([student_data])

# Apply the same preprocessing used during training
student_encoded = preprocessor.transform(student_df)

# Get probability predictions
probabilities = model.predict_proba(student_encoded)

# Find Placement Ready probability
placement_ready_index = list(model.classes_).index("Placement Ready")
placement_ready_probability = probabilities[0][placement_ready_index]

print("Placement Readiness:",
      round(placement_ready_probability * 100, 2), "%")