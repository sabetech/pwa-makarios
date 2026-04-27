import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegions, Region, deleteRegion, createRegion } from '../../api/regions';
import { fetchStreams, Stream } from '../../api/streams';
import { fetchLeaders, Leader } from '../../api/leaders';
import './ManageRegions.css';
import './AdminShared.css';

const ManageRegions: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRegionName, setNewRegionName] = useState('');
    const [selectedStreamId, setSelectedStreamId] = useState<number | ''>('');
    const [streams, setStreams] = useState<Stream[]>([]);
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [leaderSearch, setLeaderSearch] = useState('');
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const leaderDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadRegions();
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

    const loadStreams = async () => {
        try {
            const data = await fetchStreams();
            setStreams(data);
        } catch (err) {
            console.error('Error fetching streams:', err);
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

    const handleAddRegion = async () => {
        if (!newRegionName.trim()) return;
        try {
            setSubmitting(true);
            const payload: { name: string; stream_id?: number; leader_id?: number } = { name: newRegionName.trim() };
            if (selectedStreamId !== '') {
                payload.stream_id = selectedStreamId;
            }
            if (selectedLeader) {
                payload.leader_id = selectedLeader.id;
            }
            await createRegion(payload);
            resetModal();
            await loadRegions();
            showToast('Region created successfully!', 'success');
        } catch (err) {
            console.error('Error creating region:', err);
            showToast('Failed to create region. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetModal = () => {
        setNewRegionName('');
        setSelectedStreamId('');
        setSelectedLeader(null);
        setLeaderSearch('');
        setShowLeaderDropdown(false);
        setShowAddModal(false);
    };

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase())
    );

    
    const confirmDelete = (region: Region) => {
        setRegionToDelete(region);
        setDeleteModalVisible(true);
    };

    const performDelete = async () => {
        if (!regionToDelete) return;
        try {
            setIsDeleting(true);
            await deleteRegion(regionToDelete.id);
            setRegions(regions.filter(r => r.id !== regionToDelete.id));
            showToast('Region deleted successfully.', 'success');
            setDeleteModalVisible(false);
            setRegionToDelete(null);
        } catch (err) {
            console.error('Error deleting region:', err);
            showToast('Failed to delete region.', 'error');
        } finally {
            setIsDeleting(false);
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
                                <button className="action-btn delete" onClick={() => confirmDelete(region)}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAB */}
            <button
                className="add-region-fab"
                onClick={() => setShowAddModal(true)}
                aria-label="Add new region"
                id="add-region-fab"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            
            {/* Delete Confirmation Modal */}
            {deleteModalVisible && regionToDelete && (
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
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Are you sure you want to delete the region <strong>{regionToDelete.name}</strong>?</p>
                            <p className="delete-subtext" style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModalVisible(false)} disabled={isDeleting}>Cancel</button>
                            <button className="btn-submit" style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)', borderColor: 'transparent' }} onClick={performDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Region'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Region Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Region</h3>
                            <button className="modal-close" onClick={resetModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="region-name">Region Name</label>
                                <input
                                    id="region-name"
                                    type="text"
                                    placeholder="Enter region name"
                                    value={newRegionName}
                                    onChange={(e) => setNewRegionName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="region-stream">Stream</label>
                                <select
                                    id="region-stream"
                                    value={selectedStreamId}
                                    onChange={(e) => setSelectedStreamId(e.target.value ? Number(e.target.value) : '')}
                                >
                                    <option value="">Select a stream (optional)</option>
                                    {streams.map((stream) => (
                                        <option key={stream.id} value={stream.id}>{stream.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="region-leader">Leader <span className="optional-tag">(optional)</span></label>
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
                                            id="region-leader"
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
                                onClick={handleAddRegion}
                                disabled={!newRegionName.trim() || submitting}
                            >
                                {submitting ? 'Creating...' : 'Create Region'}
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

export default ManageRegions;
