# 🌾 AgriSenseMRV

AgriSenseMRV is an intelligent agriculture monitoring and crop disease detection system that leverages machine learning, geospatial data, and soil intelligence APIs to assist farmers and agricultural stakeholders.

The system takes **plant leaf images and geographic location as input**, fetches **soil parameters automatically from external APIs**, and generates **actionable health insights** for crops.

The project follows a clean separation between **frontend**, **backend**, and **machine learning** components, using industry-level best practices for scalability, maintainability, and cloud deployment.

---

## 🚀 Features

- 🌱 **Crop Disease Detection** - AI-powered plant disease identification using trained ML models
- 📍 **Geolocation Intelligence** - Automatic soil parameter fetching based on location
- 📊 **RESTful APIs** - Backend APIs for prediction and data processing
- 🌐 **Modern Web Interface** - Responsive web-based frontend for seamless user interaction
- ☁️ **Cloud-Ready Architecture** - Designed for scalable deployment
- 🔐 **Secure Data Handling** - Proper handling of large files and sensitive model data

---

## 🧠 Tech Stack

### Frontend
- **React** / **Next.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Deployment** - Vercel

### Backend
- **Python** - Core backend language
- **FastAPI** / **Flask** - High-performance REST APIs
- **External APIs** - Soil intelligence and geospatial services

### Machine Learning
- **TensorFlow** / **Keras** - Deep learning framework
- **Custom Models** - Trained crop disease classification models

---

## 📁 Project Structure

```
AgriSenseMRV/
│
├── backend/
│   ├── app.py                 # Backend entry point
│   ├── requirements.txt       # Python dependencies
│   ├── routes/                # API route handlers
│   ├── utils/                 # Helper functions
│   └── models/                # ML models (NOT tracked in Git)
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/                   # React/Next.js source code
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Build configuration
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── LICENSE                    # License file
```

> ⚠️ **Note:** `backend/venv/` and `backend/models/` are intentionally excluded from version control.

---

## 🛑 Important Notes (Read This First)

- ✅ **Virtual environments** (`venv/`) are **NOT committed** to the repository
- ✅ **ML model files** (`.h5`, `.keras`, `.pkl`) are **NOT committed** due to GitHub file size limits
- ✅ Large files must be handled via **external storage** (cloud storage, LFS, etc.)
- ✅ This ensures **clean version control** and **successful deployments**

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SachinVaishnav2980/AgriSenseMRV.git
cd AgriSenseMRV
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

The backend API will be available at `http://localhost:5000` (or configured port).

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000` (or configured port).

---

## 🧠 Machine Learning Models

ML models are **not included** in this repository due to GitHub file size restrictions.

### Options for Model Management:
- **Git LFS** (Large File Storage) for version control
- **Cloud Storage** (AWS S3, Google Cloud Storage, Azure Blob Storage)
- **Model Registry** (MLflow, DVC)
- **Direct Download** from hosting service

Please contact the repository maintainer for access to trained models.

---

## 🧩 Common Git Commands

```bash
# Check repository status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "your descriptive message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/your-feature-name
```

---

## 🌐 API Endpoints

### POST `/predict`
Upload plant leaf image and location for disease detection.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Response:**
```json
{
  "disease": "Early Blight",
  "confidence": 0.92,
  "soil_data": {...},
  "recommendations": [...]
}
```

---

## 🚀 Deployment

### Backend Deployment
- Deploy on **Railway**, **Render**, or **AWS EC2**
- Set environment variables for API keys
- Configure CORS for frontend access

### Frontend Deployment
- Deploy on **Vercel** or **Netlify**
- Update API endpoint URLs
- Configure environment variables

---

## 📌 Future Enhancements

- 🔄 **Model Optimization** - Quantization and pruning for faster inference
- ⚡ **Real-time Alerts** - Push notifications for disease detection
- ☁️ **Cloud Model Hosting** - Serverless ML inference
- 📱 **Mobile App** - React Native or Flutter application
- 🌍 **Multi-language Support** - Localization for global reach
- 📈 **Analytics Dashboard** - Historical crop health tracking

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sachin Vaishnav**
- GitHub: [@SachinVaishnav2980](https://github.com/SachinVaishnav2980)

---

## 📧 Contact & Support

For questions, issues, or collaboration opportunities:
- Open an issue on GitHub
- Contact via GitHub profile

---

## 🙏 Acknowledgments

- TensorFlow/Keras community for ML frameworks
- Open-source contributors
- Agricultural research institutions for domain knowledge

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**
