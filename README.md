# 🌾 AgriSenseMRV

AgriSenseMRV is an intelligent agriculture monitoring and crop disease detection system that leverages machine learning, geospatial data, and soil intelligence APIs to assist farmers and agricultural stakeholders.  
The system takes **plant leaf images and geographic location as input**, fetches **soil parameters automatically from external APIs**, and generates **actionable health insights** for crops.

The project follows a clean separation between **frontend**, **backend**, and **machine learning** components, using industry-level best practices for scalability, maintainability, and cloud deployment.

---

## 🚀 Features

- 🌱 Crop disease detection using trained ML models
- 📊 Backend APIs for prediction and data processing
- 🌐 Web-based frontend for user interaction
- ☁️ Cloud-ready deployment architecture
- 🔐 Secure handling of large files and models (excluded from GitHub)

---

## 🧠 Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- Deployed on **Vercel**

### Backend
- Python
- FastAPI / Flask
- REST APIs

### Machine Learning
- TensorFlow / Keras
- Trained crop disease classification models

---

## 📁 Project Structure

AgriSenseMRV/
│
├── backend/
│ ├── app.py # Backend entry point
│ ├── requirements.txt # Python dependencies
│ ├── routes/ # API routes
│ ├── utils/ # Helper functions
│ └── models/ # ML models (NOT tracked in Git)
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── vite.config.js / next.config.js
│
├── .gitignore
├── README.md
└── LICENSE


> ⚠️ `backend/venv` and `backend/models` are intentionally excluded from GitHub.

---

## 🛑 Important Notes (Read This First)

- **Virtual environments (`venv/`) are not committed**
- **ML model files (`.h5`, `.keras`, `.pkl`) are not committed**
- Large files exceed GitHub limits and must be handled externally
- This ensures clean version control and successful deployments

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SachinVaishnav2980/AgriSenseMRV.git
cd AgriSenseMRV

2️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt

Run backend:
python app.py

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧠 Machine Learning Models Handling
ML models are not included in the repository due to size restrictions.

🧩 Common Git Commands
git status
git add .
git commit -m "message"
git push origin main

📌 Future Enhancements

Model optimization and quantization
Real-time disease alerts
Cloud-based model hosting

