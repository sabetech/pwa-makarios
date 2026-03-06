import React, { useRef, useState } from 'react';
import { FiCamera, FiUpload, FiX, FiImage } from 'react-icons/fi';
import './ImageUpload.css';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageData: string) => void;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, required }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        onChange(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showCamera) {
    return (
      <div className="image-upload-camera">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="camera-preview"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="camera-controls">
          <button type="button" className="btn-capture" onClick={capturePhoto}>
            <FiCamera size={24} />
            Capture
          </button>
          <button type="button" className="btn-cancel" onClick={stopCamera}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="image-upload-container">
      <label className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      
      {value ? (
        <div className="image-preview-container">
          <img src={value} alt="Preview" className="image-preview" />
          <button type="button" className="btn-remove-image" onClick={handleRemove}>
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div className="image-upload-options">
          <button 
            type="button" 
            className="upload-option-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload size={24} />
            <span>Upload</span>
          </button>
          <button 
            type="button" 
            className="upload-option-btn"
            onClick={startCamera}
          >
            <FiCamera size={24} />
            <span>Take Photo</span>
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
