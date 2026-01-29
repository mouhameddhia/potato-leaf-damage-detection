import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { predictDisease } from './services/api';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);

  // Request permissions
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || libraryPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera and photo library permissions are required to use this app.');
      return false;
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction(null);
        setConfidence(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction(null);
        setConfidence(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  // Predict disease
  const handlePredict = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture an image first');
      return;
    }

    setLoading(true);
    try {
      const result = await predictDisease(selectedImage);
      setPrediction(result.class);
      setConfidence(result.confidence);
    } catch (error) {
      Alert.alert('Error', 'Failed to predict disease. Make sure the API server is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Get disease info
  const getDiseaseInfo = (disease) => {
    const info = {
      'Potato___Early_blight': {
        name: 'Early Blight',
        color: '#FF6B6B',
        description: 'A fungal disease that causes dark spots on leaves.',
        recommendation: 'Apply fungicide and remove infected leaves.'
      },
      'Potato___Late_blight': {
        name: 'Late Blight',
        color: '#FF4444',
        description: 'A serious disease that can destroy entire crops.',
        recommendation: 'Apply copper-based fungicide immediately and improve drainage.'
      },
      'Potato___healthy': {
        name: 'Healthy',
        color: '#4CAF50',
        description: 'The plant is healthy with no signs of disease.',
        recommendation: 'Continue regular care and monitoring.'
      }
    };
    return info[disease] || { name: disease, color: '#999', description: 'Unknown', recommendation: 'Consult an expert' };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🥔 Potato Disease Detector</Text>
        <Text style={styles.subtitle}>Capture or upload a leaf image for diagnosis</Text>

        {/* Image Display */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>📸</Text>
              <Text style={styles.placeholderSubtext}>No image selected</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>🖼️ Pick from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Predict Button */}
        {selectedImage && (
          <TouchableOpacity 
            style={[styles.predictButton, loading && styles.predictButtonDisabled]} 
            onPress={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.predictButtonText}>🔍 Analyze Disease</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Results */}
        {prediction && !loading && (
          <View style={[styles.resultContainer, { borderColor: getDiseaseInfo(prediction).color }]}>
            <Text style={styles.resultTitle}>Diagnosis Result</Text>
            <View style={[styles.diseaseTag, { backgroundColor: getDiseaseInfo(prediction).color }]}>
              <Text style={styles.diseaseName}>{getDiseaseInfo(prediction).name}</Text>
            </View>
            <Text style={styles.confidence}>
              Confidence: {(confidence * 100).toFixed(2)}%
            </Text>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Description:</Text>
              <Text style={styles.infoText}>{getDiseaseInfo(prediction).description}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Recommendation:</Text>
              <Text style={styles.infoText}>{getDiseaseInfo(prediction).recommendation}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 30,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#95a5a6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  predictButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  predictButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  predictButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  diseaseTag: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 15,
  },
  diseaseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495e',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
