import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon, FiCamera, FiUser } from 'react-icons/fi';
import { completeProfile } from '../../api/auth';
import { useMutation } from 'react-query';
import logo from '../../assets/makarios_log_trans_bg.png';
import './CompleteProfile.css';
import { useNavigate } from 'react-router-dom';

const CompleteProfile: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [phone, setPhone] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const mutation = useMutation(completeProfile, {
        onSuccess: (data) => {
            if (data.success && data.data) {
                const { user } = data.data;
                const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...existingUser,
                    phone: user.phone,
                    img_url: user.img_url,
                }));
                navigate('/dashboard');
            }
        },
        onError: (error: any) => {
            console.error('Complete profile failed:', error);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ phone, image: imageFile || undefined });
    };

    return (
        <div className="login-container">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </button>

            <div className="login-card">
                <div className="login-logo-container">
                    <img src={logo} alt="Makarios Logo" className="login-logo-img" />
                </div>
                <h1 className="login-title">Complete Your Profile</h1>
                <p className="login-subtitle">Please provide a few more details to get started</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="profile-photo-section">
                        <div className="photo-preview" onClick={() => fileInputRef.current?.click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="photo-preview-img" />
                            ) : (
                                <div className="photo-placeholder">
                                    <FiUser size={48} color="#999" />
                                </div>
                            )}
                            <div className="photo-overlay">
                                <FiCamera size={20} color="white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <p className="photo-hint">Tap to add a photo</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-input"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={mutation.isLoading || !phone}>
                        {mutation.isLoading ? 'Saving...' : 'Continue'}
                    </button>
                    {mutation.isError && (
                        <p style={{ color: 'red', marginTop: '10px' }}>
                            Failed to save profile. Please try again.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
