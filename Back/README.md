# AI Drill Bit Wear Prediction System - Backend

A comprehensive REST API for predicting drill bit wear using multi-modal analysis combining image classification and sensor data analysis.

## 🚀 Features

- **Multi-modal Analysis**: Combines image classification (MobileNetV2) with sensor data analysis (Random Forest)
- **Fusion Algorithm**: Weighted combination of predictions (60% image + 40% numeric)
- **RESTful API**: Clean, well-documented endpoints
- **CORS Enabled**: Cross-origin requests supported
- **Error Handling**: Comprehensive error handling and validation
- **Health Monitoring**: Built-in health check endpoint

## 📋 Requirements

- Python 3.8+
- TensorFlow 2.13.0+
- Flask 2.3.3+

## 🛠️ Installation

1. **Clone and navigate to the backend directory:**
```bash
cd /home/sabry/Downloads/AI/webapp/Back
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create models directory:**
```bash
mkdir -p models
```

## 🤖 Model Setup

### Option 1: Use Pre-trained Models
Place your trained models in the `models/` directory:
- `models/mobilenetv2_drillbit.h5` - Image classification model
- `models/random_forest_drillbit.pkl` - Numeric prediction model

### Option 2: Development Mode (Dummy Models)
The system will automatically create dummy models if trained models are not found, allowing you to test the API structure.

## 🚀 Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Endpoints

#### 1. **POST /predict**
Main prediction endpoint for drill bit wear analysis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Parameters:
  - `image`: Drill bit image file (png, jpg, jpeg)
  - `numeric_data`: JSON string with sensor measurements

**Numeric Data Format:**
```json
{
  "sm_speed": 150,
  "dp_press": 2500,
  "mr_flow": 500,
  "ro_pen": 25,
  "wo_bit": 100,
  "wbo_press": 3000,
  "specific_energy": 50,
  "drilling_strength": 75,
  "vibration": 2.5
}
```

**Response:**
```json
{
  "wear_level": "Medium",
  "confidence": 78.5,
  "remaining_life": 42,
  "image_confidence": 82.3,
  "numeric_class": 1
}
```

#### 2. **GET /health**
Health check endpoint to verify server and model status.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": {
    "image_model": true,
    "numeric_model": true
  }
}
```

#### 3. **GET /**
API documentation and usage information.

## 🧪 Testing

### Using the Test Client

1. **Run the server:**
```bash
python app.py
```

2. **In another terminal, run the test client:**
```bash
python test_client.py
```

### Manual Testing with cURL

```bash
# Health check
curl -X GET http://localhost:5000/health

# Prediction (replace with actual image path)
curl -X POST \
  -F "image=@/path/to/drill_bit_image.jpg" \
  -F 'numeric_data={"sm_speed":150,"dp_press":2500,"mr_flow":500,"ro_pen":25,"wo_bit":100,"wbo_press":3000,"specific_energy":50,"drilling_strength":75,"vibration":2.5}' \
  http://localhost:5000/predict
```

### Testing with Python Requests

```python
import requests
import json

# Prepare data
files = {'image': open('drill_bit.jpg', 'rb')}
data = {'numeric_data': json.dumps({
    "sm_speed": 150,
    "dp_press": 2500,
    "mr_flow": 500,
    "ro_pen": 25,
    "wo_bit": 100,
    "wbo_press": 3000,
    "specific_energy": 50,
    "drilling_strength": 75,
    "vibration": 2.5
})}

# Make request
response = requests.post('http://localhost:5000/predict', files=files, data=data)
print(response.json())
```

## 📊 Sensor Data Description

| Parameter | Description | Unit | Typical Range |
|-----------|-------------|------|--------------|
| sm_speed | Surface Motor Speed | RPM | 0-200 |
| dp_press | Downhole Pressure | PSI | 0-5000 |
| mr_flow | Mud Return Flow | GPM | 0-1000 |
| ro_pen | Rate of Penetration | ft/hr | 0-100 |
| wo_bit | Weight on Bit | lbs | 0-500 |
| wbo_press | Weight on Bit Pressure | PSI | 0-5000 |
| specific_energy | Specific Energy | MJ/m³ | 0-100 |
| drilling_strength | Drilling Strength | - | 0-100 |
| vibration | Vibration | g | 0-10 |

## 🎯 Output Classes

| Wear Level | Description | Remaining Life Range |
|------------|-------------|-------------------|
| Healthy | Minimal wear, optimal performance | 60-100% |
| Medium | Moderate wear, monitoring required | 20-60% |
| Worn | Heavy wear, replacement soon | 0-20% |

## 🔧 Configuration

### Environment Variables
- `FLASK_ENV`: Set to `production` for production deployment
- `UPLOAD_FOLDER`: Directory for temporary file uploads (default: `uploads`)

### Model Configuration
Edit the `MODEL_PATHS` dictionary in `app.py` to change model locations:
```python
MODEL_PATHS = {
    'image_model': 'path/to/your/mobilenetv2.h5',
    'numeric_model': 'path/to/your/random_forest.pkl'
}
```

## 🚨 Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid data)
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error description"
}
```

## 🌐 CORS Configuration

CORS is enabled for all origins by default. For production, modify the CORS configuration in `app.py`:
```python
CORS(app, origins=["https://yourdomain.com"])
```

## 📝 Development Notes

- Dummy models are automatically created if trained models are not found
- Image preprocessing: resize to 224x224, normalize to [0,1]
- Fusion algorithm: `Final Score = 0.6 * image_confidence + 0.4 * numeric_confidence`
- Remaining life calculation based on wear level and confidence score

## 🚀 Production Deployment

For production deployment:
1. Set `FLASK_ENV=production`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Configure proper logging
4. Set up HTTPS
5. Configure CORS for your specific domain
6. Set up monitoring and alerting

## 📞 Support

For issues or questions:
1. Check the server logs for detailed error messages
2. Verify model files are in the correct location
3. Ensure all dependencies are properly installed
4. Test with the provided test client

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-10  
**Framework**: Flask + TensorFlow + Scikit-learn
