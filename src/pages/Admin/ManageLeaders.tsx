import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaders, Leader, deleteLeader } from '../../api/leaders';
import { fetchStreams, Stream } from '../../api/streams';
import './ManageLeaders.css';
import './AdminShared.css';

const ManageLeaders: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [leaderToDelete, setLeaderToDelete] = useState<Leader | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setLeaders(await fetchLeaders());
                // Streams only power the filter; don't fail the page without them.
                fetchStreams()
                    .then(setStreams)
                    .catch(err => console.error('Error fetching streams:', err));
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load leaders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const loadLeaders = async () => {
        try {
            const data = await fetchLeaders();
            setLeaders(data);
        } catch (err) {
            console.error('Error fetching leaders:', err);
        }
    };


    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const confirmDelete = (leader: Leader) => {
        setLeaderToDelete(leader);
        setDeleteModalVisible(true);
    };

    const performDelete = async () => {
        if (!leaderToDelete) return;
        try {
            setIsDeleting(true);
            await deleteLeader(leaderToDelete.id);
            setLeaders(leaders.filter(l => l.id !== leaderToDelete.id));
            showToast('Leader removed successfully.', 'success');
            setDeleteModalVisible(false);
            setLeaderToDelete(null);
        } catch (err) {
            console.error('Error deleting leader:', err);
            showToast('Failed to delete leader. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this leader?')) {
            try {
                await deleteLeader(id);
                setLeaders(leaders.filter(l => l.id !== id));
            } catch (err) {
                console.error('Error deleting leader:', err);
                alert('Failed to delete leader.');
            }
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getAssignmentIcon = (type: string) => {
        switch (type) {
            case 'Stream': return 'waves';
            case 'Region': return 'map';
            case 'Bacenta': return 'hub';
            default: return 'person_pin_circle';
        }
    };

    const filteredLeaders = leaders.filter(leader => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            leader.name.toLowerCase().includes(term) ||
            leader.role?.toLowerCase().includes(term) ||
            leader?.leading?.name?.toLowerCase().includes(term);

        const matchesStream =
            selectedStreamId === null ||
            (leader.streams ?? []).some(s => s.id === selectedStreamId);

        return matchesSearch && matchesStream;
    });

    if (loading) {
        return (
            <div className="manage-leaders-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading leaders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-leaders-container">
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

            <div className="leaders-content-wrapper">
                <header className="leaders-header">
                    <h2 className="leaders-title">Manage Leaders</h2>
                    <p className="leaders-subtitle">
                        Track leadership development, oversee ministerial assignments, and manage the ecclesiastical hierarchy of the Makarios community.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="leader-stats">
                    <div className="stat-card-leaders">
                        <span className="material-symbols-outlined card-icon">stars</span>
                        <span className="stat-label">Total Active Leaders</span>
                        <span className="stat-value">{String(leaders.length).padStart(2, '0')}</span>
                    </div>
                    <div className="search-section">
                        <div className="admin-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search leaders, roles, or assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {streams.length > 0 && (
                            <div className="filter-chips-row">
                                <button
                                    className={`filter-chip ${selectedStreamId === null ? 'active' : ''}`}
                                    onClick={() => setSelectedStreamId(null)}
                                >
                                    All Streams
                                </button>
                                {streams.map(stream => (
                                    <button
                                        key={stream.id}
                                        className={`filter-chip ${selectedStreamId === stream.id ? 'active' : ''}`}
                                        onClick={() => setSelectedStreamId(stream.id)}
                                    >
                                        {stream.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <div className="leader-list-header">
                    <div>Leader Profile</div>
                    <div>Assignment</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="leader-list">
                    {filteredLeaders.map((leader) => (
                        <div
                            key={leader.id}
                            className="leader-card clickable"
                            role="button"
                            tabIndex={0}
                            aria-label={`Open ${leader.name}'s profile`}
                            onClick={() => navigate(`/dashboard/admin/leaders/${leader.id}`)}
                            onKeyDown={(e) => {
                                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    navigate(`/dashboard/admin/leaders/${leader.id}`);
                                }
                            }}
                        >
                            <div className="leader-accent"></div>
                            <div className="leader-identity">
                                <div className="leader-img-wrapper">
                                    {leader.img_url ? (
                                        <img src={leader.img_url} alt={leader.name} className="leader-img" />
                                    ) : (
                                        <div className="leader-initials-large">
                                            {getInitials(leader.name)}
                                        </div>
                                    )}
                                </div>
                                <div className="leader-details">
                                    <h3>{leader.name}</h3>
                                    <div className="leader-roles">
                                        <span className="role-chip">{leader.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="leader-assignment">
                                <span className="assignment-label">Currently Leading</span>
                                <div className="assignment-value">
                                    <span className="material-symbols-outlined assignment-icon">
                                        {getAssignmentIcon(leader.leading?.type || '')}
                                    </span>
                                    <div>
                                        <span>{leader.leading?.name}</span>
                                        <div className="assignment-type">{leader.leading?.type}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="leader-actions">
                                <button className="action-btn" aria-label={`Edit ${leader.name}`} onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/leaders/${leader.id}`); }}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" aria-label={`Delete ${leader.name}`} onClick={(e) => { e.stopPropagation(); confirmDelete(leader); }}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalVisible && leaderToDelete && (
                <div className="modal-overlay" onClick={() => setDeleteModalVisible(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="modal-close" onClick={() => setDeleteModalVisible(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            <span className="material-symbols-outlined delete-warning-icon" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '1rem' }}>warning</span>
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Are you sure you want to remove <strong>{leaderToDelete.name}</strong> from the leaders list?</p>
                            <p className="delete-subtext" style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModalVisible(false)} disabled={isDeleting}>Cancel</button>
                            <button className="btn-submit" style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)' }} onClick={performDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Leader'}
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

export default ManageLeaders;
