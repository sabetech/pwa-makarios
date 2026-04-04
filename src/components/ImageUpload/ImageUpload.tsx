import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiUpload, FiX, FiImage } from 'react-icons/fi';
import './ImageUpload.css';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageData: string) => void;
  required?: boolean;
  preferCamera?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, required, preferCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (showCamera) {
      document.body.classList.add('camera-active');
    } else {
      document.body.classList.remove('camera-active');
    }

    return () => {
      document.body.classList.remove('camera-active');
    };
  }, [showCamera]);

  // Handle stream cleanup specifically
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Camera track stopped on cleanup');
        });
      }
    };
  }, [stream]);

  // Ensure stream is stopped when UI is hidden
  useEffect(() => {
    if (!showCamera && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [showCamera, stream]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        if (showCamera) stopCamera();
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
      setShowCamera(true);
      // Use setTimeout to ensure video element is rendered before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
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
    setShowCamera(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAction = () => {
    if (preferCamera) {
      startCamera();
    } else {
      fileInputRef.current?.click();
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
        <div className="camera-overlay">
          <div className="camera-controls">
            <button type="button" className="btn-gallery" onClick={() => fileInputRef.current?.click()}>
              <FiImage size={24} />
              <span>Gallery</span>
            </button>
            <button type="button" className="cap-btn-outer" onClick={capturePhoto}>
              <div className="cap-btn-inner"></div>
            </button>
            <button type="button" className="btn-cancel-round" onClick={stopCamera}>
              <FiX size={24} />
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
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
        <div className="image-preview-container" onClick={handleAction} style={{ cursor: 'pointer' }}>
          <img src={value} alt="Preview" className="image-preview" title="Tap to change image" />
          <button type="button" className="btn-remove-image" onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}>
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div className="image-placeholder-trigger" onClick={handleAction}>
          <div className="trigger-content">
            <FiCamera size={32} />
            <span>{preferCamera ? 'Capture Selfie' : 'Upload Image'}</span>
            <small>Gallery option available in camera</small>
          </div>
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
