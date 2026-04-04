import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaders, Leader, deleteLeader } from '../../api/leaders';
import './ManageLeaders.css';

const ManageLeaders: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLeaders();
    }, []);

    const loadLeaders = async () => {
        try {
            setLoading(true);
            const data = await fetchLeaders();
            setLeaders(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching leaders:', err);
            setError('Failed to load leaders. Please try again later.');
        } finally {
            setLoading(false);
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

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader?.leading?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    </div>
                </section>

                <div className="leader-list-header">
                    <div>Leader Profile</div>
                    <div>Assignment</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="leader-list">
                    {filteredLeaders.map((leader) => (
                        <div key={leader.id} className="leader-card">
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
                                <button className="action-btn" onClick={() => console.log('Edit leader', leader.id)}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(leader.id)}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageLeaders;
