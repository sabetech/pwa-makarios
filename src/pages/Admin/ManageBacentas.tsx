import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBacentas, Bacenta, deleteBacenta } from '../../api/bacentas';
import { fetchStreams, Stream } from '../../api/streams';
import './ManageBacentas.css';

const ManageBacentas: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStream, setSelectedStream] = useState<string | null>(null);
    const [bacentas, setBacentas] = useState<Bacenta[]>([]);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [bacentasData, streamsData] = await Promise.all([
                    fetchBacentas(),
                    fetchStreams()
                ]);
                setBacentas(bacentasData);
                setStreams(streamsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this bacenta?')) {
            try {
                await deleteBacenta(id);
                setBacentas(bacentas.filter(b => b.id !== id));
            } catch (err) {
                console.error('Error deleting bacenta:', err);
                alert('Failed to delete bacenta.');
            }
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const filteredBacentas = bacentas.filter(bacenta => {
        const matchesSearch = bacenta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (bacenta.leader?.name && bacenta.leader.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (bacenta.region?.name && bacenta.region.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStream = !selectedStream || bacenta.region?.stream?.name === selectedStream;
        
        return matchesSearch && matchesStream;
    });

    if (loading) {
        return (
            <div className="manage-bacentas-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading bacentas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-bacentas-container">
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

            <div className="bacentas-content-wrapper">
                <header className="bacentas-header">
                    <h2 className="bacentas-title">Manage Bacentas</h2>
                    <p className="bacentas-subtitle">
                        Nurture and oversee your small group communities, track leadership development, and monitor numerical growth within the bacenta network.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="bacenta-stats">
                    <div className="stat-card-bacentas">
                        <span className="material-symbols-outlined card-icon">groups</span>
                        <span className="stat-label">Total Bacentas</span>
                        <span className="stat-value">{String(bacentas.length).padStart(2, '0')}</span>
                    </div>
                    <div className="search-section">
                        <div className="admin-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search bacentas, leaders, or regions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-chips-row">
                            <button 
                                className={`filter-chip ${!selectedStream ? 'active' : ''}`}
                                onClick={() => setSelectedStream(null)}
                            >
                                All Streams
                            </button>
                            {streams.map(stream => (
                                <button 
                                    key={stream.id}
                                    className={`filter-chip ${selectedStream === stream.name ? 'active' : ''}`}
                                    onClick={() => setSelectedStream(stream.name)}
                                >
                                    {stream.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="bacenta-list-header">
                    <div>Bacenta Identity</div>
                    <div>Leader</div>
                    <div>Location & Stream</div>
                    <div>Members</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="bacenta-list">
                    {filteredBacentas.map((bacenta) => (
                        <div key={bacenta.id} className="bacenta-card">
                            <div className="bacenta-accent"></div>
                            <div className="bacenta-identity">
                                <div className="bacenta-icon-box">
                                    <span className="material-symbols-outlined">hub</span>
                                </div>
                                <div>
                                    <h3 className="bacenta-name">{bacenta.name}</h3>
                                    <div className="bacenta-info-sub">
                                        <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>location_on</span>
                                        {bacenta.region?.name || 'No Region'}
                                    </div>
                                </div>
                            </div>

                            <div className="bacenta-leader">
                                {bacenta.leader?.img_url ? (
                                    <img src={bacenta.leader.img_url} alt={bacenta.leader.name} className="leader-avatar" />
                                ) : (
                                    <div className="leader-initials">{getInitials(bacenta.leader?.name || "")}</div>
                                )}
                                <div>
                                    <p className="leader-name">{bacenta.leader?.name || "No Leader"}</p>
                                </div>
                            </div>

                            <div className="bacenta-metrics">
                                <span className="metric-label">Region & Stream</span>
                                <span className="metric-value" style={{ fontSize: '0.875rem' }}>
                                    {bacenta.region?.name} • {bacenta.region?.stream?.name}
                                </span>
                            </div>

                            <div className="bacenta-metrics">
                                <span className="metric-label">Members</span>
                                <span className="metric-value">{bacenta.members_count}</span>
                            </div>

                            <div className="bacenta-actions">
                                <button className="action-btn" onClick={() => console.log('Edit bacenta', bacenta.id)}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(bacenta.id)}>
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

export default ManageBacentas;
