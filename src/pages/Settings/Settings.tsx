import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Settings.css';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme === 'dark';

    return (
        <div className="settings-page">
            <PageHeader title="Settings" />
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
