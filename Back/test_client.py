import requests
import json
import os

# API configuration
BASE_URL = "http://localhost:5000"
PREDICT_ENDPOINT = f"{BASE_URL}/predict"
HEALTH_ENDPOINT = f"{BASE_URL}/health"

def test_health():
    """Test the health endpoint."""
    try:
        response = requests.get(HEALTH_ENDPOINT)
        print("🏥 Health Check:")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def test_prediction(image_path, numeric_data):
    """Test the prediction endpoint."""
    try:
        # Prepare the data
        files = {'image': open(image_path, 'rb')}
        data = {'numeric_data': json.dumps(numeric_data)}
        
        print(f"🔮 Testing Prediction:")
        print(f"Image: {image_path}")
        print(f"Numeric Data: {json.dumps(numeric_data, indent=2)}")
        
        # Make the request
        response = requests.post(PREDICT_ENDPOINT, files=files, data=data)
        
        print(f"\n📊 Results:")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
        
        return response.json()
        
    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        return None

def main():
    """Main test function."""
    print("🧪 AI Drill Bit Wear Prediction System - Test Client")
    print("=" * 60)
    
    # Test health endpoint
    test_health()
    
    # Example numeric data
    example_numeric_data = {
        "sm_speed": 150,          # Surface Motor Speed (RPM)
        "dp_press": 2500,         # Downhole Pressure (PSI)
        "mr_flow": 500,           # Mud Return Flow (GPM)
        "ro_pen": 25,             # Rate of Penetration
        "wo_bit": 100,            # Weight on Bit
        "wbo_press": 3000,        # Weight on Bit Pressure
        "specific_energy": 50,      # Specific Energy
        "drilling_strength": 75,    # Drilling Strength
        "vibration": 2.5           # Vibration
    }
    
    # Test with different scenarios
    test_cases = [
        {
            "name": "Healthy Drill Bit",
            "numeric_data": example_numeric_data,
            "image_note": "Use a clean drill bit image"
        },
        {
            "name": "Medium Wear",
            "numeric_data": {
                "sm_speed": 120,
                "dp_press": 2800,
                "mr_flow": 450,
                "ro_pen": 20,
                "wo_bit": 120,
                "wbo_press": 3200,
                "specific_energy": 65,
                "drilling_strength": 60,
                "vibration": 3.8
            },
            "image_note": "Use a moderately worn drill bit image"
        },
        {
            "name": "Heavy Wear",
            "numeric_data": {
                "sm_speed": 80,
                "dp_press": 3500,
                "mr_flow": 350,
                "ro_pen": 15,
                "wo_bit": 150,
                "wbo_press": 3800,
                "specific_energy": 85,
                "drilling_strength": 40,
                "vibration": 5.2
            },
            "image_note": "Use a heavily worn drill bit image"
        }
    ]
    
    print("\n🎯 Test Cases:")
    print("=" * 60)
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n{i}. {case['name']}")
        print(f"   Note: {case['image_note']}")
        
        # Note: In a real scenario, you would provide actual image paths
        # For testing, you can create dummy images or use existing ones
        image_path = f"test_image_{i}.jpg"  # Replace with actual image paths
        
        if os.path.exists(image_path):
            test_prediction(image_path, case['numeric_data'])
        else:
            print(f"   ⚠️  Image file not found: {image_path}")
            print(f"   📝 To test, create/place an image at: {image_path}")

if __name__ == "__main__":
    main()
