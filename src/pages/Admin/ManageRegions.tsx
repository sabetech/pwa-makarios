import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegions, Region, deleteRegion } from '../../api/regions';
import './ManageRegions.css';

const ManageRegions: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRegions();
    }, []);

    const loadRegions = async () => {
        try {
            setLoading(true);
            const data = await fetchRegions();
            setRegions(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching regions:', err);
            setError('Failed to load regions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this region?')) {
            try {
                await deleteRegion(id);
                setRegions(regions.filter(r => r.id !== id));
            } catch (err) {
                console.error('Error deleting region:', err);
                alert('Failed to delete region.');
            }
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const filteredRegions = regions.filter(region => 
        region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (region.leader?.name && region.leader.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="manage-regions-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading regions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-regions-container">
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

            <div className="regions-content-wrapper">
                <header className="regions-header">
                    <h2 className="regions-title">Manage Regions</h2>
                    <p className="regions-subtitle">
                        Define geographic territories, manage regional councils, and optimize territorial expansion across the ecclesiastical landscape.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="region-stats">
                    <div className="stat-card-regions">
                        <span className="material-symbols-outlined card-icon">map</span>
                        <span className="stat-label">Total Active Regions</span>
                        <span className="stat-value">{String(regions.length).padStart(2, '0')}</span>
                    </div>
                    <div className="search-section">
                        <div className="admin-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input 
                                type="text" 
                                placeholder="Search regions or leaders..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="region-list-header">
                    <div>Region Identity</div>
                    <div>Regional Leader</div>
                    <div>Metrics</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="region-list">
                    {filteredRegions.map((region) => (
                        <div key={region.id} className="region-card">
                            <div className="region-accent"></div>
                            <div className="region-identity">
                                <div className="region-icon-box">
                                    <span className="material-symbols-outlined">explore</span>
                                </div>
                                <div>
                                    <h3 className="region-name">{region.name}</h3>
                                    <span className="stream-tier">{region?.stream?.name}</span>
                                </div>
                            </div>

                            <div className="region-leader">
                                {region.leader?.img_url ? (
                                    <img src={region.leader.img_url} alt={region.leader.name} className="leader-avatar" />
                                ) : (
                                    <div className="leader-initials">{getInitials(region.leader?.name || "")}</div>
                                )}
                                <div>
                                    <p className="leader-name">{region.leader?.name || "No Leader Assigned"}</p>
                                </div>
                            </div>

                            <div className="region-metrics-group">
                                <div className="region-metrics">
                                    <span className="metric-label">Bacentas</span>
                                    <span className="metric-value">{region.bacenta_count}</span>
                                </div>
                                <div className="region-metrics">
                                    <span className="metric-label">Members</span>
                                    <span className="metric-value">{region.members_count}</span>
                                </div>
                            </div>

                            <div className="region-actions">
                                <button className="action-btn" onClick={() => console.log('Edit region', region.id)}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(region.id)}>
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

export default ManageRegions;
