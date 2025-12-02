# AgriSense-MRV Backend Server

## Quick Start

### Method 1: Direct Python Execution (Recommended for Development)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate the virtual environment:**
   
   **On Windows (PowerShell):**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   **On Windows (Command Prompt):**
   ```cmd
   venv\Scripts\activate.bat
   ```
   
   **On Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

3. **Start the server:**
   ```bash
   python app.py
   ```

   The server will start on `http://localhost:5000`

### Method 2: Using Flask CLI

1. **Activate virtual environment** (same as above)

2. **Set Flask app:**
   ```bash
   set FLASK_APP=app.py
   ```
   (On Linux/Mac: `export FLASK_APP=app.py`)

3. **Run Flask:**
   ```bash
   flask run --host=0.0.0.0 --port=5000
   ```

### Method 3: Production Mode with Gunicorn

For production deployment:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Server Configuration

- **Host:** `0.0.0.0` (accessible from all network interfaces)
- **Port:** `5000`
- **Debug Mode:** Enabled (for development)

## API Endpoints

Once the server is running, you can access:

- **Health Check:** `GET http://localhost:5000/`
- **Crop Disease Prediction:** `POST http://localhost:5000/api/predict/crop-disease`
- **Soil Health Analysis:** `POST http://localhost:5000/api/predict/soil-health`
- **Integrated Analysis:** `POST http://localhost:5000/api/predict/integrated`

## Expected Output

When the server starts successfully, you should see:

```
Initializing AgriSense-MRV Backend...
Loading models...
✓ Crop disease model loaded successfully
✓ Soil health model loaded successfully
✓ Soil disease risk model loaded successfully
✓ Using manual encoding (label encoders file has compatibility issues - this is normal)
Backend ready!
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to any available port
```

### Virtual Environment Issues
If you need to recreate the virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Model Loading Errors
Make sure all model files are present in the `models/` directory:
- `best_finetuned_model.h5`
- `soil_health_regression.pkl`
- `soil_disease_risk.pkl`

