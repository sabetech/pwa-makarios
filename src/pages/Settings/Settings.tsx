import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import './Settings.css';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme === 'dark';

    return (
        <div className="settings-page">
            <div className="settings-appbar">
                <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
                    <FiArrowLeft size={24} />
                </button>
                <h1 className="settings-title">Settings</h1>
            </div>
            <div className="settings-container">
                <div className="settings-section">
                    <div className="settings-section-title">Appearance</div>
                    <div className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-item-icon">
                                {isDarkMode ? <FiMoon /> : <FiSun />}
                            </div>
                            <div>
                                <div className="settings-item-label">Dark Mode</div>
                                <div className="settings-item-description">
                                    {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                                </div>
                            </div>
                        </div>
                        <button
                            className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
