# Smart Healthcare Prediction & Emergency Alert System

A complete final-year project that predicts patient health risk using ML and sends emergency alerts when high-risk conditions are detected.

## Features
- Patient registration/login style demo
- Health input form
- ML-based risk prediction
- Risk levels: Low, Medium, High
- Emergency alert trigger
- Doctor/Admin dashboard
- Prediction history
- Email alert-ready backend
- Clean React frontend
- Flask + Python ML backend

## Tech Stack
Frontend:
- React.js
- Vite
- CSS

Backend:
- Flask
- Flask-CORS
- scikit-learn
- pandas
- joblib

ML:
- Random Forest Classifier

## Folder Structure
```
smart-healthcare-project/
│
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── healthcare_data.csv
│   └── models/
│
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── style.css
```

## How to Run Backend

```bash
cd backend
pip install -r requirements.txt
python train_model.py
python app.py
```

Backend runs on:

```text
http://localhost:5000
```

## How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Prediction Inputs
- Age
- Gender
- Blood Pressure
- Sugar Level
- Heart Rate
- Oxygen Level
- Temperature
- Chest Pain
- Breathing Problem
- Fatigue

## Emergency Alert Logic
Alert is generated when:
- ML prediction is High Risk
- Oxygen level is below 90
- Heart rate is above 120
- BP is above 160
- Sugar level is above 250
- Temperature is above 102°F

## Note
This project is for academic/demo purposes only. It is not a real medical diagnosis system.
