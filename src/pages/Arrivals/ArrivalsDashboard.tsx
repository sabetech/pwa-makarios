import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiPlus, FiXCircle, FiTruck } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchArrivals, ArrivalsData } from '../../api/arrivals';
import './ArrivalsDashboard.css';

const ArrivalsDashboard: React.FC = () => {
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [arrivalsData, setArrivalsData] = useState<ArrivalsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchArrivals(date);
            setArrivalsData(res);
        } catch (err) {
            console.error('Failed to fetch arrivals:', err);
            setError('Failed to load arrivals data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(selectedDate);
    }, [selectedDate]);

    const isBacentaLeader = arrivalsData?.role === 'Bacenta Leader';

    return (
        <div className="arrivals-dashboard-page">
            <PageHeader title="Arrivals" />

            <div className="arrivals-header-actions">
                <div className="date-picker-wrapper">
                    <FiCalendar className="date-icon" />
                    <input
                        type="date"
                        className="date-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <button
                    className="btn-fill-arrivals"
                    onClick={() => navigate('/dashboard/arrivals/fill')}
                >
                    <FiPlus /> Fill Form
                </button>
            </div>

            {loading ? (
                <div className="arrivals-loading">
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                </div>
            ) : error ? (
                <div className="arrivals-error">{error}</div>
            ) : arrivalsData ? (
                <div className="arrivals-content">
                    {/* Stat Cards Row */}
                    <div className="arrivals-stats-row">
                        <div className="arrivals-stat-card">
                            <span className="stat-value">{arrivalsData.total_bussed}</span>
                            <span className="stat-label">Total People Bussed</span>
                        </div>
                        <div className="arrivals-stat-card">
                            <span className="stat-value">
                                {arrivalsData.breakdown.filter((b) => b.filled).length} / {arrivalsData.breakdown.length}
                            </span>
                            <span className="stat-label">Bacentas Reported</span>
                        </div>
                    </div>

                    {/* Breakdown Section */}
                    <div className="arrivals-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                {isBacentaLeader ? 'My Bacenta Bussing Entry' : 'Bacenta Breakdown'}
                            </h2>
                        </div>

                        {arrivalsData.breakdown.length === 0 ? (
                            <div className="empty-arrivals">No bacentas found under your scope.</div>
                        ) : (
                            <div className="bacenta-breakdown-list">
                                {arrivalsData.breakdown.map((item) => (
                                    <div key={item.bacenta_id} className={`breakdown-card ${item.filled ? 'filled' : 'pending'}`}>
                                        <div className="breakdown-card-left">
                                            <div className="bacenta-badge">
                                                <FiUsers />
                                            </div>
                                            <div className="breakdown-info">
                                                <h3 className="bacenta-name">{item.bacenta_name}</h3>
                                                <p className="bacenta-meta">
                                                    Leader: <strong>{item.leader_name}</strong>
                                                    {item.region_name && item.region_name !== 'N/A' && ` • ${item.region_name}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="breakdown-card-right">
                                            {item.filled ? (
                                                <div className="bussed-count-badge">
                                                    <span className="count">{item.number_bussed}</span>
                                                    <span className="label">bussed</span>
                                                </div>
                                            ) : (
                                                <div className="pending-badge">
                                                    <FiXCircle />
                                                    <span>Not Filled</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ArrivalsDashboard;
