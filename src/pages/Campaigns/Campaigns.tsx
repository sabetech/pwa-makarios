import React from 'react';
import { FiBell, FiSearch, FiTrendingUp, FiDownload } from 'react-icons/fi';
import './Campaigns.css';

const Campaigns: React.FC = () => {
    return (
        <div className="campaigns-page">
            <header className="campaigns-header">
                <div className="header-top">
                    <div className="header-title-container">
                        <span className="material-symbols-outlined campaign-icon">campaign</span>
                        <h1 className="page-title">Campaigns</h1>
                    </div>
                    <button className="icon-btn">
                        <FiBell />
                    </button>
                </div>
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search initiatives..."
                        className="search-input"
                    />
                </div>
            </header>

            <main className="campaigns-content">
                <section>
                    <h2 className="section-label">Active Initiatives</h2>
                    <div className="initiatives-grid">
                        {/* Antibrutish */}
                        <div className="initiative-card">
                            <div className="initiative-icon-container maroon-bg">
                                <span className="material-symbols-outlined">shield_with_heart</span>
                            </div>
                            <div className="initiative-details">
                                <div className="initiative-header">
                                    <h3 className="initiative-name">Antibrutish</h3>
                                    <span className="status-badge ongoing">Ongoing</span>
                                </div>
                                <p className="initiative-description">Focus on shepherd training and quality member care.</p>
                                <div className="initiative-progress">
                                    <div className="progress-bar-container">
                                        <div className="progress-bar maroon" style={{ width: '60%' }}></div>
                                    </div>
                                    <span className="progress-label">12 Sessions</span>
                                </div>
                            </div>
                        </div>

                        {/* Sheep Seeking */}
                        <div className="initiative-card">
                            <div className="initiative-icon-container primary-bg">
                                <span className="material-symbols-outlined">person_search</span>
                            </div>
                            <div className="initiative-details">
                                <div className="initiative-header">
                                    <h3 className="initiative-name">Sheep Seeking</h3>
                                    <span className="status-badge active">Active</span>
                                </div>
                                <p className="initiative-description">Soul winning and aggressive evangelism drive.</p>
                                <div className="initiative-metric">
                                    <FiTrendingUp className="metric-icon" />
                                    <span>45 New Souls Registered</span>
                                </div>
                            </div>
                        </div>

                        {/* Multiplication */}
                        <div className="initiative-card">
                            <div className="initiative-icon-container maroon-bg">
                                <span className="material-symbols-outlined">groups_3</span>
                            </div>
                            <div className="initiative-details">
                                <div className="initiative-header">
                                    <h3 className="initiative-name">Multiplication</h3>
                                    <span className="status-badge progress">In Progress</span>
                                </div>
                                <p className="initiative-description">Strategic growth of existing cell structures.</p>
                                <div className="initiative-footer">
                                    <span className="target-label">Target: 2x Growth</span>
                                    <button className="text-link">View Details</button>
                                </div>
                            </div>
                        </div>

                        {/* Bacenta Proliferation */}
                        <div className="initiative-card">
                            <div className="initiative-icon-container primary-bg">
                                <span className="material-symbols-outlined">add_home_work</span>
                            </div>
                            <div className="initiative-details">
                                <div className="initiative-header">
                                    <h3 className="initiative-name">Bacenta Proliferation</h3>
                                    <span className="status-badge milestone">Milestone</span>
                                </div>
                                <p className="initiative-description">Focus on starting and stabilizing new Bacentas.</p>
                                <div className="initiative-stats">
                                    <span className="stat-label">Launched this month:</span>
                                    <span className="stat-value">5 New</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="reports-banner">
                    <div className="banner-content">
                        <h4 className="banner-title">Campaign Reports</h4>
                        <p className="banner-text">Download the latest analysis of all active church initiatives.</p>
                        <button className="banner-btn">
                            <FiDownload /> Get Monthly PDF
                        </button>
                    </div>
                    <span className="material-symbols-outlined banner-bg-icon">analytics</span>
                </div>
            </main>
        </div>
    );
};

export default Campaigns;
