import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStream, fetchStreamRegions, Stream } from '../../api/streams';
import { Region } from '../../api/regions';
import './StreamDetails.css';
import './AdminShared.css';

const StreamDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [stream, setStream] = useState<Stream | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStreamData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [streamData, regionsData] = await Promise.all([
                    fetchStream(id),
                    fetchStreamRegions(id)
                ]);
                setStream(streamData);
                setRegions(regionsData);
                setError(null);
            } catch (err) {
                console.error('Error loading stream details:', err);
                setError('Failed to load stream details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadStreamData();
    }, [id]);

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
        return (
            <div className="stream-details-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading stream details...</p>
                </div>
            </div>
        );
    }

    if (error || !stream) {
        return (
            <div className="stream-details-container flex items-center justify-center">
                <div className="text-center p-6 bg-error-container text-on-error-container rounded-lg max-w-md mx-4">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <p className="mb-4">{error || "Stream details not found."}</p>
                    <button className="btn-cancel" onClick={() => navigate('/dashboard/admin/streams')}>
                        Back to Streams
                    </button>
                </div>
            </div>
        );
    }

    const days = stream.meeting_day.split(',');

    return (
        <div className="stream-details-container">
            <header className="admin-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/dashboard/admin/streams')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="admin-logo">MAKARIOS</h1>
                </div>
                <div className="header-right">
                    <button className="icon-btn" onClick={() => navigate('/dashboard/settings')}>
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <div className="stream-details-wrapper">
                <header className="details-header-section">
                    <div className="header-title-row">
                        <div className="stream-avatar-badge">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                            <span className="stream-tier-label">{stream.description || 'Stream'}</span>
                            <h2 className="stream-details-title">{stream.name}</h2>
                        </div>
                    </div>
                </header>

                <div className="details-grid">
                    <div className="details-card stream-info-card">
                        <h3 className="card-section-title">Stream Information</h3>
                        <div className="stream-info-list">
                            <div className="stream-info-row">
                                <span className="material-symbols-outlined">schedule</span>
                                <div>
                                    <span className="info-label">Meeting Time</span>
                                    <span className="info-value">{stream.meeting_time}</span>
                                </div>
                            </div>
                            <div className="stream-info-row">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <div>
                                    <span className="info-label">Meeting Days</span>
                                    <div className="day-badges">
                                        {days.map((day) => (
                                            <span key={day} className="day-badge">{day.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {stream.overseer && (
                                <div className="stream-info-row">
                                    <span className="material-symbols-outlined">person</span>
                                    <div>
                                        <span className="info-label">Overseer</span>
                                        <div className="overseer-info">
                                            {stream.overseer.imgurl ? (
                                                <img src={stream.overseer.imgurl} alt={stream.overseer.name} className="overseer-avatar" />
                                            ) : (
                                                <div className="overseer-initials">{getInitials(stream.overseer.name)}</div>
                                            )}
                                            <div>
                                                <span className="info-value">{stream.overseer.name}</span>
                                                {stream.overseer.role && (
                                                    <span className="overseer-role">{stream.overseer.role}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-card stats-summary-card">
                        <h3 className="card-section-title">Overview</h3>
                        <div className="details-stats-row">
                            <div className="details-stat-box">
                                <span className="stat-value-large">{regions.length}</span>
                                <span className="stat-label-small">Regions</span>
                            </div>
                            <div className="details-stat-box">
                                <span className="stat-value-large">
                                    {regions.reduce((sum, r) => sum + (r.bacenta_count || 0), 0)}
                                </span>
                                <span className="stat-label-small">Bacentas</span>
                            </div>
                            <div className="details-stat-box">
                                <span className="stat-value-large">
                                    {regions.reduce((sum, r) => sum + (r.members_count || 0), 0)}
                                </span>
                                <span className="stat-label-small">Members</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="details-list-section">
                    <div className="section-header-row">
                        <h3 className="section-title">Regions in {stream.name}</h3>
                        <span className="badge-count">{regions.length} Regions</span>
                    </div>

                    {regions.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined">explore</span>
                            <p>No regions registered in this stream yet.</p>
                        </div>
                    ) : (
                        <div className="regions-grid-list">
                            {regions.map((region) => (
                                <div
                                    key={region.id}
                                    className="region-summary-card"
                                    onClick={() => navigate(`/dashboard/admin/regions/${region.id}`)}
                                >
                                    <div className="region-card-accent"></div>
                                    <div className="region-card-header">
                                        <h4 className="region-card-title">{region.name}</h4>
                                        {region.leader && (
                                            <div className="region-leader-row">
                                                {region.leader.img_url ? (
                                                    <img src={region.leader.img_url} alt={region.leader.name} className="region-leader-img" />
                                                ) : (
                                                    <div className="region-leader-initials">{getInitials(region.leader.name)}</div>
                                                )}
                                                <span className="region-leader-name">{region.leader.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="region-card-metrics">
                                        <div className="region-metric">
                                            <span className="metric-num">{region.bacenta_count}</span>
                                            <span className="metric-lbl">Bacentas</span>
                                        </div>
                                        <div className="region-metric">
                                            <span className="metric-num">{region.members_count}</span>
                                            <span className="metric-lbl">Members</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StreamDetails;
