import axios from 'axios';

export interface PredictionParams {
  smSpeed: number;
  dpPress: number;
  mrFlow: number;
  roPen: number;
  woBit: number;
  wboPress: number;
  specificEnergy: number;
  drillingStrength: number;
  vibration: number;
  image?: File; // File object for upload
}

export interface PredictionResult {
  wearLevel: "Healthy" | "Medium" | "Worn";
  confidence: number;
  remainingUsefulLife: number;
  analysis: string;
}

export async function predictWear(params: PredictionParams): Promise<PredictionResult> {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add image if provided
    if (params.image) {
      formData.append('image', params.image);
    }
    
    // Add numeric data as JSON string
    const numericData = {
      sm_speed: params.smSpeed,
      dp_press: params.dpPress,
      mr_flow: params.mrFlow,
      ro_pen: params.roPen,
      wo_bit: params.woBit,
      wbo_press: params.wboPress,
      specific_energy: params.specificEnergy,
      drilling_strength: params.drillingStrength,
      vibration: params.vibration
    };
    
    formData.append('numeric_data', JSON.stringify(numericData));
    
    // Make POST request to Flask backend
    const response = await axios.post('http://localhost:5000/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    // Transform Flask response to match expected interface
    const flaskResult = response.data;
    
    return {
      wearLevel: flaskResult.wear_level || "Healthy",
      confidence: flaskResult.confidence || 0,
      remainingUsefulLife: flaskResult.remaining_life || 0,
      analysis: generateAnalysis(flaskResult.wear_level, flaskResult.confidence, numericData)
    };
    
  } catch (error) {
    console.error("Prediction failed:", error);
    
    // Handle different error types
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error("Cannot connect to backend server. Please ensure the Flask server is running on localhost:5000");
      } else if (error.response) {
        const serverError = error.response.data?.error || error.response.statusText;
        throw new Error(`Server error: ${serverError}`);
      } else {
        throw new Error("Network error. Please check your connection and try again.");
      }
    } else {
      throw new Error("Failed to predict wear level. Please check your inputs and try again.");
    }
  }
}

// Generate analysis text based on prediction results
function generateAnalysis(wearLevel: string, confidence: number, params: any): string {
  const wearDescriptions = {
    "Healthy": "The drill bit shows minimal wear characteristics with optimal performance parameters.",
    "Medium": "The drill bit exhibits moderate wear patterns requiring close monitoring.",
    "Worn": "The drill bit displays significant wear indicators suggesting immediate replacement."
  };
  
  const baseAnalysis = wearDescriptions[wearLevel as keyof typeof wearDescriptions] || "Analysis unavailable.";
  
  // Add specific insights based on parameters
  let insights = [];
  
  if (params.vibration > 3.0) {
    insights.push("elevated vibration levels indicate bearing wear");
  }
  
  if (params.specific_energy > 60) {
    insights.push("high specific energy suggests reduced cutting efficiency");
  }
  
  if (params.ro_pen < 20 && wearLevel !== "Healthy") {
    insights.push("reduced rate of penetration confirms wear progression");
  }
  
  const confidenceText = confidence > 80 ? "high confidence" : confidence > 60 ? "moderate confidence" : "low confidence";
  
  return `${baseAnalysis} Analysis based on ${confidenceText}.${insights.length > 0 ? ' Key indicators: ' + insights.join(', ') + '.' : ''}`;
}
