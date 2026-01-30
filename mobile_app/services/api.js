import axios from 'axios';

// Update this with your backend API URL
// For local testing on Android emulator: use http://10.0.2.2:8000
// For local testing on iOS simulator: use http://localhost:8000
// For local testing on physical device: use your computer's local IP (e.g., http://192.168.1.100:8000)
const API_URL = 'http://192.168.1.28:8000'; // Using your network IP for physical device

/**
 * Predict disease from image
 * @param {string} imageUri - The URI of the image to predict
 * @returns {Promise<Object>} - The prediction result with class and confidence
 */
export const predictDisease = async (imageUri) => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append image to form data
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    // Send POST request to backend
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to predict disease');
  }
};

/**
 * Ping the API to check if it's running
 * @returns {Promise<boolean>} - True if API is running
 */
export const pingAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/ping`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
