import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error predicting. Make sure the API is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Potato Disease Classification</h1>
      </header>

      <div className="container">
        {!preview ? (
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">☁️</div>
            <p className="upload-text">Drag and drop an image of a potato plant leaf to process</p>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="fileInput" className="upload-button">
              Choose File
            </label>
          </div>
        ) : (
          <div className="preview-area">
            <img src={preview} alt="Preview" className="preview-image" />
            
            {!result ? (
              <div className="button-group">
                <button onClick={handleSubmit} className="predict-button" disabled={loading}>
                  {loading ? 'Analyzing...' : 'Predict Disease'}
                </button>
                <button onClick={reset} className="reset-button">
                  Upload New Image
                </button>
              </div>
            ) : (
              <div className="result-area">
                <h2>Results:</h2>
                <div className="result-card">
                  <p className="result-class">
                    <strong>Disease:</strong> {result.class}
                  </p>
                  <p className="result-confidence">
                    <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
                  </p>
                </div>
                <button onClick={reset} className="reset-button">
                  Analyze Another Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
