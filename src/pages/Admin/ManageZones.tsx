import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchZones, Zone, createZone, updateZone } from '../../api/zones';
import { fetchRegions, Region } from '../../api/regions';
import { fetchLeaders, Leader } from '../../api/leaders';
import './ManageZones.css';
import './AdminShared.css';

const ManageZones: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [zones, setZones] = useState<Zone[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');
    const [selectedRegionId, setSelectedRegionId] = useState<number | ''>('');
    const [regionSearch, setRegionSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [zoneToEdit, setZoneToEdit] = useState<Zone | null>(null);
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [leaderSearch, setLeaderSearch] = useState('');
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const regionDropdownRef = useRef<HTMLDivElement>(null);
    const leaderDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target as Node)) {
                setShowRegionDropdown(false);
            }
            if (leaderDropdownRef.current && !leaderDropdownRef.current.contains(e.target as Node)) {
                setShowLeaderDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [zonesData, regionsData, leadersData] = await Promise.all([fetchZones(), fetchRegions(), fetchLeaders()]);
            setZones(zonesData);
            setRegions(regionsData);
            setLeaders(leadersData);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load zones. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAddZone = async () => {
        if (!newZoneName.trim() || !selectedRegion) return;
        try {
            setSubmitting(true);
            const payload: { name: string; region_id: number; leader_id?: number } = { name: newZoneName.trim(), region_id: selectedRegion.id };
            if (selectedLeader) {
                payload.leader_id = selectedLeader.id;
            }
            await createZone(payload);
            resetModal();
            await loadData();
            showToast('Zone created successfully!', 'success');
        } catch (err) {
            console.error('Error creating zone:', err);
            showToast('Failed to create zone. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetModal = () => {
        setNewZoneName('');
        setSelectedRegionId('');
        setSelectedRegion(null);
        setRegionSearch('');
        setShowRegionDropdown(false);
        setSelectedLeader(null);
        setLeaderSearch('');
        setShowLeaderDropdown(false);
        setShowAddModal(false);
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const confirmDelete = (zone: Zone) => {
        setZoneToDelete(zone);
        setDeleteModalVisible(true);
    };

    const handleEditClick = (zone: Zone) => {
        setZoneToEdit(zone);
        if (zone.leader) {
            const matchedLeader = leaders.find(l => l.id === zone.leader?.id);
            setSelectedLeader(matchedLeader || null);
        } else {
            setSelectedLeader(null);
        }
        setLeaderSearch('');
        setEditModalVisible(true);
    };

    const handleUpdateZone = async () => {
        if (!zoneToEdit) return;
        try {
            setEditSubmitting(true);
            const payload: { name?: string; region_id?: number; leader_id?: number } = {};
            if (selectedLeader) {
                payload.leader_id = selectedLeader.id;
            }
            await updateZone(zoneToEdit.id, payload);
            await loadData();
            showToast('Zone updated successfully!', 'success');
            setEditModalVisible(false);
            setZoneToEdit(null);
        } catch (err) {
            console.error('Error updating zone:', err);
            showToast('Failed to update zone. Please try again.', 'error');
        } finally {
            setEditSubmitting(false);
        }
    };

    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(regionSearch.toLowerCase())
    );

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase())
    );

    const filteredZones = zones.filter(zone =>
        zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zone.region?.name && zone.region.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="manage-zones-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading zones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-zones-container">
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

            <div className="zones-content-wrapper">
                <header className="zones-header">
                    <h2 className="zones-title">Manage Zones</h2>
                    <p className="zones-subtitle">
                        Define and manage zones within your regions. Zones help organize clusters of bacentas for better administration.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="zone-stats">
                    <div className="stat-card-zones">
                        <span className="material-symbols-outlined card-icon">share_location</span>
                        <span className="stat-label">Total Zones</span>
                        <span className="stat-value">{String(zones.length).padStart(2, '0')}</span>
                    </div>
                    <div className="search-section">
                        <div className="admin-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search zones or regions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="zone-list-header">
                    <div>Zone Identity</div>
                    <div>Region</div>
                    <div>Metrics</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="zone-list">
                    {filteredZones.map((zone) => (
                        <div key={zone.id} className="zone-card">
                            <div className="zone-accent"></div>
                            <div className="zone-identity">
                                <div className="zone-icon-box">
                                    <span className="material-symbols-outlined">share_location</span>
                                </div>
                                <div>
                                    <h3 className="zone-name">{zone.name}</h3>
                                </div>
                            </div>

                            <div className="zone-region">
                                <span>{zone.region?.name || 'No Region'}</span>
                            </div>

                            <div className="zone-metrics-group">
                                <div className="zone-metrics">
                                    <span className="metric-label">Bacentas</span>
                                    <span className="metric-value">{zone.bacenta_count || 0}</span>
                                </div>
                                <div className="zone-metrics">
                                    <span className="metric-label">Members</span>
                                    <span className="metric-value">{zone.members_count || 0}</span>
                                </div>
                            </div>

                            <div className="zone-actions">
                                <button className="action-btn" onClick={() => handleEditClick(zone)}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => confirmDelete(zone)}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAB */}
            <button
                className="add-zone-fab"
                onClick={() => setShowAddModal(true)}
                aria-label="Add new zone"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Add Zone Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Zone</h3>
                            <button className="modal-close" onClick={resetModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="zone-name">Zone Name</label>
                                <input
                                    id="zone-name"
                                    type="text"
                                    placeholder="Enter zone name"
                                    value={newZoneName}
                                    onChange={(e) => setNewZoneName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group" ref={regionDropdownRef}>
                                <label htmlFor="zone-region">Region</label>
                                {selectedRegion ? (
                                    <div className="selected-item-chip">
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedRegion.name}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedRegion(null);
                                                setRegionSearch('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="zone-region"
                                            type="text"
                                            placeholder="Search for a region..."
                                            value={regionSearch}
                                            onChange={(e) => {
                                                setRegionSearch(e.target.value);
                                                setShowRegionDropdown(true);
                                            }}
                                            onFocus={() => setShowRegionDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showRegionDropdown && !selectedRegion && (
                                    <div className="custom-dropdown">
                                        {filteredRegions.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No regions found</p>
                                            </div>
                                        ) : (
                                            filteredRegions.slice(0, 8).map((region) => (
                                                <div
                                                    key={region.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedRegion(region);
                                                        setRegionSearch('');
                                                        setShowRegionDropdown(false);
                                                    }}
                                                >
                                                    <div className="dropdown-info">
                                                        <span className="dropdown-name">{region.name}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="zone-leader">Leader (Optional)</label>
                                {selectedLeader ? (
                                    <div className="selected-item-chip">
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
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="zone-leader"
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
                                    <div className="custom-dropdown">
                                        {filteredLeaders.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No leaders found</p>
                                            </div>
                                        ) : (
                                            filteredLeaders.slice(0, 8).map((leader) => (
                                                <div
                                                    key={leader.id}
                                                    className="dropdown-item"
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
                                onClick={handleAddZone}
                                disabled={!newZoneName.trim() || !selectedRegion || submitting}
                            >
                                {submitting ? 'Creating...' : 'Create Zone'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Zone Modal */}
            {editModalVisible && zoneToEdit && (
                <div className="modal-overlay" onClick={() => setEditModalVisible(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Zone</h3>
                            <button className="modal-close" onClick={() => setEditModalVisible(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Zone Name</label>
                                <input
                                    type="text"
                                    value={zoneToEdit.name}
                                    disabled
                                    style={{ opacity: 0.6 }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Region</label>
                                <input
                                    type="text"
                                    value={zoneToEdit.region?.name || 'No Region'}
                                    disabled
                                    style={{ opacity: 0.6 }}
                                />
                            </div>
                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="zone-leader">Leader</label>
                                {selectedLeader ? (
                                    <div className="selected-item-chip">
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
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="zone-leader"
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
                                    <div className="custom-dropdown">
                                        {filteredLeaders.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No leaders found</p>
                                            </div>
                                        ) : (
                                            filteredLeaders.slice(0, 8).map((leader) => (
                                                <div
                                                    key={leader.id}
                                                    className="dropdown-item"
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
                            <button className="btn-cancel" onClick={() => setEditModalVisible(false)} disabled={editSubmitting}>Cancel</button>
                            <button
                                className="btn-submit"
                                onClick={handleUpdateZone}
                                disabled={editSubmitting}
                            >
                                {editSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalVisible && zoneToDelete && (
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
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Are you sure you want to delete the zone <strong>{zoneToDelete.name}</strong>?</p>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModalVisible(false)} disabled={isDeleting}>Cancel</button>
                            <button className="btn-submit" style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)', borderColor: 'transparent' }} onClick={async () => {
                                try {
                                    setIsDeleting(true);
                                    const { deleteZone } = await import('../../api/zones');
                                    await deleteZone(zoneToDelete.id);
                                    setZones(zones.filter(z => z.id !== zoneToDelete.id));
                                    showToast('Zone deleted successfully.', 'success');
                                    setDeleteModalVisible(false);
                                    setZoneToDelete(null);
                                } catch (err) {
                                    showToast('Failed to delete zone.', 'error');
                                } finally {
                                    setIsDeleting(false);
                                }
                            }} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Zone'}
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

export default ManageZones;