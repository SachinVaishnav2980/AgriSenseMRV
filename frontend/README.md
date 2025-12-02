# AgriSense MRV Frontend

A modern, animated React frontend with Tailwind CSS for the AgriSense MRV agricultural intelligence platform.

## Features

- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ✨ **Animations** - Smooth animations using Framer Motion
- 📱 **Responsive** - Works on all devices
- 🚀 **Fast** - Built with Vite for lightning-fast development
- 🎯 **Three Analysis Modes**:
  - Crop Disease Detection
  - Soil Health Analysis
  - Integrated Analysis

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Make Sure Backend is Running

The frontend connects to the backend API at `http://localhost:5000`. Make sure the backend server is running before using the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── CropDiseaseDetection.jsx
│   │   ├── SoilHealthAnalysis.jsx
│   │   └── IntegratedAnalysis.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons

## API Integration

The frontend connects to the backend API endpoints:
- `POST /api/predict/crop-disease` - Crop disease detection
- `POST /api/predict/soil-health` - Soil health analysis
- `POST /api/predict/integrated` - Integrated analysis

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme.

### Animations

Animations are handled by Framer Motion. Check component files for animation configurations.

## Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

