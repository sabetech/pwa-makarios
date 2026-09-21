import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStreams, createStream, Stream } from '../../api/streams';
import { fetchLeaders, Leader } from '../../api/leaders';
import './ManageStreams.css';
import './AdminShared.css';

const MEETING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ManageStreams: React.FC = () => {
    const navigate = useNavigate();
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStreamName, setNewStreamName] = useState('');
    const [newStreamDescription, setNewStreamDescription] = useState('');
    const [meetingDay, setMeetingDay] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [leaderSearch, setLeaderSearch] = useState('');
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const leaderDropdownRef = useRef<HTMLDivElement>(null);

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

    const loadLeaders = async () => {
        try {
            const data = await fetchLeaders();
            setLeaders(data);
        } catch (err) {
            console.error('Error fetching leaders:', err);
        }
    };

    useEffect(() => {
        loadStreams();
        loadLeaders();
    }, []);

    // Close leader dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (leaderDropdownRef.current && !leaderDropdownRef.current.contains(e.target as Node)) {
                setShowLeaderDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const resetModal = () => {
        setNewStreamName('');
        setNewStreamDescription('');
        setMeetingDay('');
        setMeetingTime('');
        setSelectedLeader(null);
        setLeaderSearch('');
        setShowLeaderDropdown(false);
        setShowAddModal(false);
    };

    const handleAddStream = async () => {
        if (!newStreamName.trim() || !meetingDay || !meetingTime) return;
        try {
            setSubmitting(true);
            await createStream({
                name: newStreamName.trim(),
                description: newStreamDescription.trim() || undefined,
                meeting_day: meetingDay,
                meeting_time: meetingTime,
                overseer_id: selectedLeader?.id,
            });
            resetModal();
            await loadStreams();
            showToast('Stream created successfully!', 'success');
        } catch (err: any) {
            console.error('Error creating stream:', err);
            const message = err?.response?.data?.message || 'Failed to create stream. Please try again.';
            showToast(message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase())
    );

    const isFormValid = newStreamName.trim() !== '' && meetingDay !== '' && meetingTime !== '';

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
                        const days = (stream.meeting_day || '').split(',').map((d) => d.trim()).filter(Boolean);

                        return (
                            <div key={stream.id} className={`stream-card ${type}-tier`} onClick={() => navigate(`/dashboard/admin/streams/${stream.id}`)}>
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

            {/* FAB */}
            <button
                className="add-stream-fab"
                onClick={() => setShowAddModal(true)}
                aria-label="Add new stream"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Add Stream Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Stream</h3>
                            <button className="modal-close" onClick={resetModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="stream-name">Stream Name</label>
                                <input
                                    id="stream-name"
                                    type="text"
                                    placeholder="Enter stream name"
                                    value={newStreamName}
                                    onChange={(e) => setNewStreamName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stream-description">Description <span className="optional-tag">(optional)</span></label>
                                <input
                                    id="stream-description"
                                    type="text"
                                    placeholder="e.g. Morning devotional service"
                                    value={newStreamDescription}
                                    onChange={(e) => setNewStreamDescription(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stream-day">Meeting Day</label>
                                <select
                                    id="stream-day"
                                    value={meetingDay}
                                    onChange={(e) => setMeetingDay(e.target.value)}
                                >
                                    <option value="">Select a day</option>
                                    {MEETING_DAYS.map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stream-time">Meeting Time</label>
                                <input
                                    id="stream-time"
                                    type="time"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                />
                            </div>
                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="stream-overseer">Overseer <span className="optional-tag">(optional)</span></label>
                                {selectedLeader ? (
                                    <div className="selected-leader-chip">
                                        {selectedLeader.img_url ? (
                                            <img src={selectedLeader.img_url} alt={selectedLeader.name} className="chip-avatar" />
                                        ) : (
                                            <div className="chip-initials">{getInitials(selectedLeader.name)}</div>
                                        )}
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedLeader.name}</span>
                                            <span className="chip-role">{selectedLeader.role}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedLeader(null);
                                                setLeaderSearch('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="leader-search-wrapper">
                                        <span className="material-symbols-outlined leader-search-icon">search</span>
                                        <input
                                            id="stream-overseer"
                                            type="text"
                                            placeholder="Search for a leader..."
                                            value={leaderSearch}
                                            onChange={(e) => {
                                                setLeaderSearch(e.target.value);
                                                setShowLeaderDropdown(true);
                                            }}
                                            onFocus={() => setShowLeaderDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showLeaderDropdown && !selectedLeader && (
                                    <div className="leader-dropdown">
                                        {filteredLeaders.length === 0 ? (
                                            <div className="leader-dropdown-empty">
                                                <span className="material-symbols-outlined">person_off</span>
                                                <p>No leaders found</p>
                                            </div>
                                        ) : (
                                            filteredLeaders.slice(0, 8).map((leader) => (
                                                <div
                                                    key={leader.id}
                                                    className="leader-dropdown-item"
                                                    onClick={() => {
                                                        setSelectedLeader(leader);
                                                        setLeaderSearch('');
                                                        setShowLeaderDropdown(false);
                                                    }}
                                                >
                                                    {leader.img_url ? (
                                                        <img src={leader.img_url} alt={leader.name} className="dropdown-avatar" />
                                                    ) : (
                                                        <div className="dropdown-initials">{getInitials(leader.name)}</div>
                                                    )}
                                                    <div className="dropdown-info">
                                                        <span className="dropdown-name">{leader.name}</span>
                                                        <span className="dropdown-role">{leader.role}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={resetModal}>Cancel</button>
                            <button
                                className="btn-submit"
                                onClick={handleAddStream}
                                disabled={!isFormValid || submitting}
                            >
                                {submitting ? 'Creating...' : 'Create Stream'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`toast-notification ${toast.type}`}>
                    <span className="material-symbols-outlined">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <p>{toast.message}</p>
                </div>
            )}
        </div>
    );
};

export default ManageStreams;
