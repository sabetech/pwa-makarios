import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStreams, Stream } from '../../api/streams';
import './ManageStreams.css';

const ManageStreams: React.FC = () => {
    const navigate = useNavigate();
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStreams = async () => {
            try {
                setLoading(true);
                const data = await fetchStreams();
                setStreams(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching streams:', err);
                setError('Failed to load streams. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadStreams();
    }, []);

    const getTier = (name: string) => {
        if (name.toLowerCase().includes('morning')) return 'Devotional Tier';
        if (name.toLowerCase().includes('mid-day')) return 'Wisdom Encounter';
        return 'Atmosphere Tier';
    };

    const getType = (name: string): 'primary' | 'secondary' | 'tertiary' => {
        if (name.toLowerCase().includes('morning')) return 'primary';
        if (name.toLowerCase().includes('mid-day')) return 'secondary';
        return 'tertiary';
    };

    const getIcon = (name: string) => {
        if (name.toLowerCase().includes('jesus experience')) return 'wb_sunny';
        if (name.toLowerCase().includes('fresh oil')) return 'light_mode';
        return 'auto_awesome';
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className="manage-streams-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading streams...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-streams-container">
            <header className="admin-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/dashboard/admin')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="admin-profile-img">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbULG3nrHtJyy-h0O17JBNpxnUdZiOsUIsLHZdnBOmNuE8E5VDav27O5Zz2aOVIutvdTol7CbWUu3nJRKuBxwjVfAOsmVajT_FdQpFg9883ZeVdJ3uBqUUnLYYMa9sN7qXbvDvmb-FVMcnMq1i3ddTHrTIE_FULqUe32-aHWYFrwJqok1BmGr3TiYBiA4E4Qe4h7tB_YAO2kxrZF4-EToscePQz8juFJ44UCfkvKa_tBj7bV2ZBY6zBni2v5VWeKOz3bcEtDujTOf"
                            alt="Admin"
                        />
                    </div>
                    <h1 className="admin-logo">MAKARIOS</h1>
                </div>
                <div className="header-right">
                    <button className="icon-btn" onClick={() => navigate('/dashboard/settings')}>
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <div className="streams-content-wrapper">
                <header className="streams-header">
                    <h2 className="streams-title">Manage Streams</h2>
                    <p className="streams-subtitle">
                        Configure and orchestrate your church service time slots and leadership assignments within the sanctuary ecosystem.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="stats-overview">
                    <div className="stat-card-total">
                        <span className="material-symbols-outlined card-icon">church</span>
                        <span className="stat-label">Total Active Streams</span>
                        <span className="stat-value">{String(streams.length).padStart(2, '0')}</span>
                    </div>
                </section>

                <div className="stream-list-header">
                    <div>Stream Identity</div>
                    <div>Schedule & Timing</div>
                    <div>Stream Leader</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="stream-list">
                    {streams.map((stream) => {
                        const type = getType(stream.name);
                        const tier = getTier(stream.name);
                        const icon = getIcon(stream.name);
                        const days = stream.meeting_day.split(',');

                        return (
                            <div key={stream.id} className={`stream-card ${type}-tier`}>
                                <div className="stream-accent"></div>
                                <div className="stream-identity">
                                    <div className="stream-icon-box">
                                        <span className="material-symbols-outlined">
                                            {icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="stream-name">{stream.name}</h3>
                                        <span className="stream-tier">{stream.description}</span>
                                    </div>
                                </div>

                                <div className="stream-schedule">
                                    <div className="info-row">
                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--admin-secondary)' }}>
                                            schedule
                                        </span>
                                        <span className="time">{stream.meeting_time}</span>
                                    </div>
                                    <div className="day-badges">
                                        {days.map((day) => (
                                            <span key={day} className="day-badge">{day.trim()}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="stream-leader">
                                    {stream.overseer?.imgurl ? (
                                        <img src={stream.overseer?.imgurl} alt={stream.overseer?.name} className="leader-avatar" />
                                    ) : (
                                        <div className="leader-initials">{getInitials(stream?.overseer?.name || "")}</div>
                                    )}
                                    <div>
                                        <p className="leader-name">{stream.overseer?.name}</p>
                                        <p className="leader-role">{stream.overseer?.role}</p>
                                    </div>
                                </div>

                                <div className="stream-actions">
                                    <button className="action-btn">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="action-btn delete">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ManageStreams;
