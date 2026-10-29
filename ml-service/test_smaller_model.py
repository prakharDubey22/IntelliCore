import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
import joblib
#import matplotlib.pyplot as plt


# Load the dataset
df = pd.read_csv("placement_prediction_dataset_100k_clean.csv")

# Display the first five rows
print(df.head())

# Select numerical columns
numerical_columns = df.select_dtypes(include="number").columns

# Check minimum and maximum values
for column in numerical_columns:
    print(
        column,
        "-> Min:",
        df[column].min(),
        "| Max:",
        df[column].max()
    )

    # Check missing values in each column
missing_values = df.isnull().sum()

print("\nMissing values in each column:")
print(missing_values)

# Separate features and target

X = df.drop(
    columns=["placement_status", "internship_experience"]
)

y = df["placement_status"]


# Display the shapes
print("\nFeatures shape:", X.shape)
print("Target shape:", y.shape)

# Display all feature columns
print("\nFeatures in X:")
print(X.columns.tolist())

# Select categorical columns
categorical_columns = X.select_dtypes(
    include=["object", "string", "category"]
).columns.tolist()
# Select numerical columns
numerical_columns = X.select_dtypes(
    include=["number"]
).columns.tolist()

print("\nCategorical columns:")
print(categorical_columns)

print("\nNumerical columns:")
print(numerical_columns)
# this block belongs to preprocessing
preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(), categorical_columns),
                    ("numerical", "passthrough", numerical_columns),
        ]
)
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y # this is used to maintain equal praportion between training and testing data
)

print(y_train.value_counts())
print(y_test.value_counts())
X_train_encoded = preprocessor.fit_transform(X_train)
X_test_encoded = preprocessor.transform(X_test)
print("Encoded training shape:", X_train_encoded.shape)
print("Encoded testing shape:", X_test_encoded.shape)

# this is our random forest model,here 100 decision tree our made to analyze our data
model = RandomForestClassifier(
    n_estimators=50,
    max_depth=16,
    min_samples_leaf=2,
    random_state=42,
    class_weight={
        "Not Ready": 1,
        "Needs Improvement": 1,
        "Placement Ready": 3,
    },
    n_jobs=2,
)
# line to train our model
model.fit(X_train_encoded, y_train)

#this is the line to check that our model is trained perfectly
print("Training completed successfully!")

# checking  our modal testing data
y_pred = model.predict(X_test_encoded)

#printing first 10 prediction
print(y_pred[:10])

# now checking our modal accuracy by actual score to the modal predicted score
accuracy = accuracy_score(y_test, y_pred)
print("Model Accuracy:", accuracy)

#for classification report because accuracy is low
print(classification_report(y_test, y_pred))

#now creating confusion metrix to get exact count of corrct and incorrect prediction
cm = confusion_matrix(y_test, y_pred)

## for ploting graph of our confusion matrix
#plt.figure(figsize=(8, 6))
#plt.imshow(cm, cmap="Blues")
#plt.show()

print(cm)
# give exact order used by confusion matrix model
print("Class order:", model.classes_)

# convert confusion matrix into redable data
cm_df = pd.DataFrame(
    cm,
    index=model.classes_,
    columns=model.classes_
)

print(cm_df)

# Display unique values in each categorical column

for column in categorical_columns:
    print(f"\nColumn: {column}")
    print(X[column].unique())


# now for probability of target

y_pred = model.predict(X_test_encoded)
y_proba = model.predict_proba(X_test_encoded)

print("First 5 probability predictions:")
print(y_proba[:5])

print("Class order:", model.classes_)

joblib.dump(model, "random_forest_model_medium.pkl")
joblib.dump(preprocessor, "preprocessor_medium.pkl")
print("Model and preprocessor saved successfully!")

   
   
   
   
   
   
   
   
   
   
    # we are checking now which input feature is contributing most in our prediction
'''print(df.groupby("placement_status")["dsa_score"].mean())
importance_df = pd.DataFrame({
    "Feature": preprocessor.get_feature_names_out(),
    "Importance": model.feature_importances_
})

print(importance_df.sort_values("Importance", ascending=False))
print(
    df.groupby("placement_status")[
        ["cgpa", "coding_skill_score", "dsa_score", "mock_interview_score"]
    ].mean()
)
print(df.groupby("placement_status")["cgpa"].mean())
print(
    df.groupby("placement_status")[
        [
            "cgpa",
            "coding_skill_score",
            "dsa_score",
            "aptitude_score",
            "communication_score",
            "mock_interview_score"
        ]
    ].mean()
)
print(
    df.groupby("placement_status")["dsa_score"].agg(["min", "max"])
)'''
# using gradient boosting
'''from sklearn.ensemble import HistGradientBoostingClassifier

# Select numerical features
X_numeric = df[numerical_columns]

# Same split
X_train_num, X_test_num, y_train_num, y_test_num = train_test_split(
    X_numeric,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create model
gb_model = HistGradientBoostingClassifier(
    max_iter=300,
    random_state=42
)

# Train
gb_model.fit(X_train_num, y_train_num)

# Predict
gb_pred = gb_model.predict(X_test_num)

# Accuracy
gb_accuracy = accuracy_score(y_test_num, gb_pred)

print("Gradient Boosting Accuracy:", gb_accuracy)
#converting categorial data into numerical for gradient boosting
X_train_dense = X_train_encoded
X_test_dense = X_test_encoded

print("Train shape:", X_train_dense.shape)
print("Test shape:", X_test_dense.shape)
# Gradient Boosting with all 35 features
gb_model_encoded = HistGradientBoostingClassifier(
    max_iter=300,
    random_state=42
)
#train our model of gradient boosting
gb_model_encoded.fit(X_train_dense, y_train)
gb_pred_encoded = gb_model_encoded.predict(X_test_dense)
gb_accuracy_encoded = accuracy_score(y_test, gb_pred_encoded)

 # printing accuarcy of our graient boosting model

print("Gradient Boosting Accuracy with 35 features:", gb_accuracy_encoded)

# print traing and testing accuracy

train_pred_encoded = gb_model_encoded.predict(X_train_dense)

train_accuracy_encoded = accuracy_score(
    y_train,
    train_pred_encoded
)

print("Training Accuracy:", train_accuracy_encoded)
print("Testing Accuracy:", gb_accuracy_encoded)
print(classification_report(y_test, gb_pred_encoded))'''

