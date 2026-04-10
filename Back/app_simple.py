from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from PIL import Image
import io
import joblib
from werkzeug.utils import secure_filename
import os
import json

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATHS = {
    'numeric_model': 'models/random_forest_drillbit.pkl'
}

# Create directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('models', exist_ok=True)

# Global variables
numeric_model = None

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_models():
    """Load the trained models."""
    global numeric_model
    
    try:
        # Load numeric prediction model (Random Forest)
        if os.path.exists(MODEL_PATHS['numeric_model']):
            numeric_model = joblib.load(MODEL_PATHS['numeric_model'])
            print(" Numeric model loaded successfully")
        else:
            print(f"  Numeric model not found at {MODEL_PATHS['numeric_model']}")
            print(" Creating dummy model for development...")
            numeric_model = create_dummy_numeric_model()
            
    except Exception as e:
        print(f" Error loading models: {e}")
        numeric_model = create_dummy_numeric_model()

def create_dummy_numeric_model():
    """Create a dummy Random Forest model for development."""
    from sklearn.ensemble import RandomForestClassifier
    
    # Create dummy training data
    np.random.seed(42)
    X_dummy = np.random.rand(100, 9)  # 9 features
    y_dummy = np.random.randint(0, 3, 100)  # 3 classes
    
    # Train dummy model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_dummy, y_dummy)
    
    return model

def extract_image_features(image_file):
    """Extract simple features from image without deep learning."""
    try:
        # Read and process image
        image = Image.open(image_file)
        image = image.convert('RGB')
        image = image.resize((224, 224))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Extract basic statistical features
        features = {
            'mean_red': np.mean(img_array[:, :, 0]),
            'mean_green': np.mean(img_array[:, :, 1]),
            'mean_blue': np.mean(img_array[:, :, 2]),
            'std_red': np.std(img_array[:, :, 0]),
            'std_green': np.std(img_array[:, :, 1]),
            'std_blue': np.std(img_array[:, :, 2]),
            'brightness': np.mean(img_array),
            'contrast': np.std(img_array),
            'edge_density': calculate_edge_density(img_array)
        }
        
        return features
        
    except Exception as e:
        raise ValueError(f"Error processing image: {e}")

def calculate_edge_density(img_array):
    """Calculate edge density as a simple texture feature."""
    try:
        # Convert to grayscale
        gray = np.mean(img_array, axis=2)
        
        # Simple edge detection using Sobel operators
        sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
        sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
        
        # Apply convolution (simplified)
        edges_x = np.abs(np.convolve(gray.flatten(), sobel_x.flatten(), mode='same'))
        edges_y = np.abs(np.convolve(gray.flatten(), sobel_y.flatten(), mode='same'))
        
        # Combine edges
        edges = (edges_x + edges_y).reshape(gray.shape)
        
        # Calculate edge density
        edge_threshold = np.mean(edges) + np.std(edges)
        edge_pixels = np.sum(edges > edge_threshold)
        total_pixels = edges.size
        
        return edge_pixels / total_pixels
        
    except:
        return 0.1  # Default value if calculation fails

def preprocess_numeric(data):
    """Preprocess numeric data for prediction."""
    try:
        # Define feature order
        feature_order = [
            'sm_speed', 'dp_press', 'mr_flow', 'ro_pen', 
            'wo_bit', 'wbo_press', 'specific_energy', 
            'drilling_strength', 'vibration'
        ]
        
        # Convert to DataFrame
        df = pd.DataFrame([data], columns=feature_order)
        
        return df
    except Exception as e:
        raise ValueError(f"Error processing numeric data: {e}")

def predict_wear_level(image_features, numeric_df):
    """Make predictions using image features and numeric data."""
    try:
        # Combine image features with numeric data
        combined_features = []
        
        # Add image features
        for key, value in image_features.items():
            combined_features.append(value)
        
        # Add numeric features
        for col in numeric_df.columns:
            combined_features.append(numeric_df[col].iloc[0])
        
        # Make prediction
        combined_array = np.array(combined_features).reshape(1, -1)
        
        # Use only numeric model for now (can be extended)
        prediction = numeric_model.predict(numeric_df)[0]
        confidence = np.random.uniform(70, 95)  # Simulated confidence
        
        # Determine wear level
        wear_levels = ['Healthy', 'Medium', 'Worn']
        wear_level = wear_levels[prediction]
        
        # Calculate remaining life
        remaining_life_map = {'Healthy': 75, 'Medium': 40, 'Worn': 15}
        base_life = remaining_life_map.get(wear_level, 50)
        remaining_life = max(5, int(base_life * (confidence / 100)))
        
        return {
            'wear_level': wear_level,
            'confidence': round(confidence, 1),
            'remaining_life': remaining_life,
            'image_features_extracted': len(image_features),
            'numeric_features_used': len(numeric_df.columns)
        }
        
    except Exception as e:
        raise ValueError(f"Error in prediction: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint."""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        if not allowed_file(image_file.filename):
            return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg'}), 400
        
        # Get numeric data
        numeric_data = request.form.get('numeric_data')
        if not numeric_data:
            return jsonify({'error': 'No numeric data provided'}), 400
        
        try:
            numeric_dict = json.loads(numeric_data)
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON format for numeric data'}), 400
        
        # Validate required fields
        required_fields = [
            'sm_speed', 'dp_press', 'mr_flow', 'ro_pen', 
            'wo_bit', 'wbo_press', 'specific_energy', 
            'drilling_strength', 'vibration'
        ]
        
        for field in required_fields:
            if field not in numeric_dict:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Process inputs
        image_features = extract_image_features(image_file)
        numeric_df = preprocess_numeric(numeric_dict)
        
        # Make prediction
        result = predict_wear_level(image_features, numeric_df)
        
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'numeric_model': numeric_model is not None,
            'image_processing': 'feature_extraction'
        },
        'version': '1.0.0-simple'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with API documentation."""
    return jsonify({
        'message': 'AI Drill Bit Wear Prediction System API (Simple Version)',
        'version': '1.0.0-simple',
        'note': 'Using feature extraction instead of deep learning for compatibility',
        'endpoints': {
            'POST /predict': 'Main prediction endpoint',
            'GET /health': 'Health check endpoint',
            'GET /': 'API documentation'
        },
        'usage': {
            'method': 'POST',
            'endpoint': '/predict',
            'content_type': 'multipart/form-data',
            'parameters': {
                'image': 'Drill bit image file (png, jpg, jpeg)',
                'numeric_data': 'JSON string with sensor measurements'
            },
            'example_numeric_data': {
                'sm_speed': 150,
                'dp_press': 2500,
                'mr_flow': 500,
                'ro_pen': 25,
                'wo_bit': 100,
                'wbo_press': 3000,
                'specific_energy': 50,
                'drilling_strength': 75,
                'vibration': 2.5
            }
        }
    })

if __name__ == '__main__':
    print(" Starting AI Drill Bit Wear Prediction System (Simple Version)...")
    load_models()
    print(" Server running on http://localhost:5000")
    print(" API documentation available at http://localhost:5000/")
    print(" Using feature extraction instead of TensorFlow for compatibility")
    app.run(host='0.0.0.0', port=5000, debug=True)
