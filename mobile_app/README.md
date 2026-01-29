# Potato Disease Detector - Mobile App

A React Native mobile application for detecting potato leaf diseases using machine learning.

## Features

- 📷 **Camera Integration**: Take photos directly from the app
- 🖼️ **Image Gallery**: Select images from your photo library
- 🔍 **Disease Detection**: AI-powered disease prediction
- 📊 **Confidence Scores**: See prediction confidence levels
- 💡 **Recommendations**: Get treatment recommendations for detected diseases

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator

## Installation

1. Navigate to the mobile_app directory:
```bash
cd mobile_app
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Before running the app, update the API URL in `services/api.js`:

- **Android Emulator**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://localhost:8000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:8000` (e.g., `http://192.168.1.100:8000`)

To find your computer's local IP:
- **Windows**: Run `ipconfig` and look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` or `ip addr`

## Running the App

1. Start the backend API server first (from the project root):
```bash
cd api
pip install -r requirements.txt
python main.py
```

2. Start the Expo development server:
```bash
npm start
```

3. Choose your platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
mobile_app/
├── App.js                 # Main application component
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration
└── services/
    └── api.js            # API service for backend communication
```

## Supported Diseases

The app can detect:
- ✅ **Healthy**: Normal potato leaf
- 🔴 **Early Blight**: Fungal disease with dark spots
- 🔴 **Late Blight**: Serious fungal disease

## Troubleshooting

### Camera/Gallery not working
- Make sure you've granted camera and photo library permissions
- Check that the permissions are properly configured in `app.json`

### API Connection Issues
- Verify the backend API is running on port 8000
- Check that the API_URL in `services/api.js` is correct
- Ensure your device and computer are on the same network (for physical devices)
- Try disabling firewall temporarily for testing

### Image Upload Fails
- Check that the image format is supported (JPEG, PNG)
- Verify the API endpoint is working by testing with Postman or curl

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS App
```bash
expo build:ios
```

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform
- **Expo Camera**: Camera access
- **Expo Image Picker**: Image selection
- **Axios**: HTTP client for API calls

## License

MIT
