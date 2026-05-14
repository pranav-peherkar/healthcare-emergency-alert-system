import React, { useState, useEffect } from "react";
import { HeartPulse, ShieldAlert, Activity, ClipboardList } from "lucide-react";

const API_URL = "http://localhost:5000";

export default function App() {
  const [form, setForm] = useState({
    patient_name: "",
    age: "",
    gender: "1",
    bp: "",
    sugar: "",
    heart_rate: "",
    oxygen: "",
    temp: "",
    chest_pain: "0",
    breathing_problem: "0",
    fatigue: "0",
    contact: ""
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    total_predictions: 0,
    low_risk: 0,
    medium_risk: 0,
    high_risk: 0,
    emergency_cases: 0
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`);
      const data = await res.json();
      setHistory(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          gender: Number(form.gender),
          bp: Number(form.bp),
          sugar: Number(form.sugar),
          heart_rate: Number(form.heart_rate),
          oxygen: Number(form.oxygen),
          temp: Number(form.temp),
          chest_pain: Number(form.chest_pain),
          breathing_problem: Number(form.breathing_problem),
          fatigue: Number(form.fatigue)
        })
      });

      const data = await res.json();
      setResult(data);
      fetchHistory();
      fetchStats();
    } catch (error) {
      alert("Backend not running. Start Flask server first.");
    }
  };

  const riskClass = (risk) => {
    if (risk === "High Risk") return "high";
    if (risk === "Medium Risk") return "medium";
    return "low";
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>Smart Healthcare Prediction & Emergency Alert System</h1>
          <p>
            AI-based health risk prediction system that detects abnormal patient
            conditions and generates emergency alerts.
          </p>
        </div>
        <HeartPulse size={70} className="hero-icon" />
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <Activity />
          <h3>{stats.total_predictions}</h3>
          <p>Total Predictions</p>
        </div>
        <div className="stat-card">
          <ShieldAlert />
          <h3>{stats.emergency_cases}</h3>
          <p>Emergency Cases</p>
        </div>
        <div className="stat-card">
          <ClipboardList />
          <h3>{stats.high_risk}</h3>
          <p>High Risk Patients</p>
        </div>
      </section>

      <main className="main-grid">
        <section className="panel">
          <h2>Patient Health Form</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid">
              <input name="patient_name" placeholder="Patient Name" value={form.patient_name} onChange={handleChange} required />
              <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />

              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>

              <input name="contact" placeholder="Emergency Contact" value={form.contact} onChange={handleChange} required />
              <input name="bp" type="number" placeholder="Blood Pressure" value={form.bp} onChange={handleChange} required />
              <input name="sugar" type="number" placeholder="Sugar Level" value={form.sugar} onChange={handleChange} required />
              <input name="heart_rate" type="number" placeholder="Heart Rate" value={form.heart_rate} onChange={handleChange} required />
              <input name="oxygen" type="number" placeholder="Oxygen Level" value={form.oxygen} onChange={handleChange} required />
              <input name="temp" type="number" step="0.1" placeholder="Temperature °F" value={form.temp} onChange={handleChange} required />

              <select name="chest_pain" value={form.chest_pain} onChange={handleChange}>
                <option value="0">No Chest Pain</option>
                <option value="1">Chest Pain</option>
              </select>

              <select name="breathing_problem" value={form.breathing_problem} onChange={handleChange}>
                <option value="0">No Breathing Problem</option>
                <option value="1">Breathing Problem</option>
              </select>

              <select name="fatigue" value={form.fatigue} onChange={handleChange}>
                <option value="0">No Fatigue</option>
                <option value="1">Fatigue</option>
              </select>
            </div>

            <button type="submit">Predict Health Risk</button>
          </form>
        </section>

        <section className="panel result-panel">
          <h2>Prediction Result</h2>

          {!result && <p className="muted">Submit patient details to view prediction.</p>}

          {result && !result.error && (
            <div className={`result-card ${riskClass(result.risk_level)}`}>
              <h3>{result.patient_name}</h3>
              <p className="risk">{result.risk_level}</p>
              <p><b>Emergency:</b> {result.emergency ? "Yes" : "No"}</p>
              <p><b>Contact:</b> {result.contact}</p>
              <p><b>Time:</b> {result.time}</p>

              {result.alerts.length > 0 && (
                <div className="alerts">
                  <h4>Emergency Alerts</h4>
                  {result.alerts.map((a, i) => (
                    <p key={i}>⚠️ {a}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {result?.error && <p className="error">{result.error}</p>}
        </section>
      </main>

      <section className="panel history">
        <h2>Doctor/Admin Dashboard - Prediction History</h2>

        {history.length === 0 ? (
          <p className="muted">No predictions yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Risk</th>
                  <th>Emergency</th>
                  <th>Contact</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.patient_name}</td>
                    <td><span className={`badge ${riskClass(item.risk_level)}`}>{item.risk_level}</span></td>
                    <td>{item.emergency ? "Yes" : "No"}</td>
                    <td>{item.contact}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
