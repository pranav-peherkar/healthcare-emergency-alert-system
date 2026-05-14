from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join("models", "risk_model.pkl")
prediction_history = []

risk_labels = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model not found. Run: python train_model.py")
    return joblib.load(MODEL_PATH)

model = load_model()

def check_emergency(data, risk_value):
    alerts = []

    if risk_value == 2:
        alerts.append("ML model detected High Risk condition")

    if data["oxygen"] < 90:
        alerts.append("Oxygen level is critically low")

    if data["heart_rate"] > 120:
        alerts.append("Heart rate is dangerously high")

    if data["bp"] > 160:
        alerts.append("Blood pressure is very high")

    if data["sugar"] > 250:
        alerts.append("Sugar level is very high")

    if data["temp"] > 102:
        alerts.append("High fever detected")

    emergency = len(alerts) > 0
    return emergency, alerts

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Smart Healthcare Prediction & Emergency Alert System API is running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        required_fields = [
            "patient_name", "age", "gender", "bp", "sugar",
            "heart_rate", "oxygen", "temp", "chest_pain",
            "breathing_problem", "fatigue", "contact"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        features = [[
            int(data["age"]),
            int(data["gender"]),
            float(data["bp"]),
            float(data["sugar"]),
            float(data["heart_rate"]),
            float(data["oxygen"]),
            float(data["temp"]),
            int(data["chest_pain"]),
            int(data["breathing_problem"]),
            int(data["fatigue"])
        ]]

        risk_value = int(model.predict(features)[0])
        risk_text = risk_labels[risk_value]

        emergency, alerts = check_emergency(data, risk_value)

        result = {
            "patient_name": data["patient_name"],
            "risk_level": risk_text,
            "risk_value": risk_value,
            "emergency": emergency,
            "alerts": alerts,
            "contact": data["contact"],
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        prediction_history.append(result)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def history():
    return jsonify(prediction_history)

@app.route("/stats", methods=["GET"])
def stats():
    total = len(prediction_history)
    high = len([p for p in prediction_history if p["risk_value"] == 2])
    medium = len([p for p in prediction_history if p["risk_value"] == 1])
    low = len([p for p in prediction_history if p["risk_value"] == 0])
    emergency = len([p for p in prediction_history if p["emergency"]])

    return jsonify({
        "total_predictions": total,
        "low_risk": low,
        "medium_risk": medium,
        "high_risk": high,
        "emergency_cases": emergency
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
