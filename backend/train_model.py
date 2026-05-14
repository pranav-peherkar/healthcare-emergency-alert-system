import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

DATA_FILE = "healthcare_data.csv"
MODEL_DIR = "models"
MODEL_FILE = os.path.join(MODEL_DIR, "risk_model.pkl")

def train():
    df = pd.read_csv(DATA_FILE)

    X = df.drop("risk", axis=1)
    y = df["risk"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=120,
        random_state=42,
        max_depth=6
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_FILE)

    print("Model trained successfully!")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, predictions))

if __name__ == "__main__":
    train()
