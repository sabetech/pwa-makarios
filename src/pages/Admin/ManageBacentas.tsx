import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBacentas, Bacenta, deleteBacenta, createBacenta, updateBacenta } from '../../api/bacentas';
import { fetchRegions, Region } from '../../api/regions';
import { fetchLeaders, Leader } from '../../api/leaders';
import { fetchStreams, Stream } from '../../api/streams';
import { fetchZones, Zone } from '../../api/zones';
import './ManageBacentas.css';
import './AdminShared.css';

const ManageBacentas: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStream, setSelectedStream] = useState<string | null>(null);
    const [bacentas, setBacentas] = useState<Bacenta[]>([]);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bacentaToEdit, setBacentaToEdit] = useState<Bacenta | null>(null);
    const [newBacentaName, setNewBacentaName] = useState('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [regionSearch, setRegionSearch] = useState('');
    const [leaderSearch, setLeaderSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
    const [showEditRegionDropdown, setShowEditRegionDropdown] = useState(false);
    const [editName, setEditName] = useState('');
    const [editRegionSearch, setEditRegionSearch] = useState('');
    const [selectedEditRegion, setSelectedEditRegion] = useState<Region | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [editZoneSearch, setEditZoneSearch] = useState('');
    const [selectedEditZone, setSelectedEditZone] = useState<Zone | null>(null);
    const [showEditZoneDropdown, setShowEditZoneDropdown] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const regionDropdownRef = useRef<HTMLDivElement>(null);
    const leaderDropdownRef = useRef<HTMLDivElement>(null);


    
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target as Node)) {
                setShowRegionDropdown(false);
            }
            if (leaderDropdownRef.current && !leaderDropdownRef.current.contains(e.target as Node)) {
                setShowLeaderDropdown(false);
            }
            const editRegionDropdown = document.getElementById('edit-region-dropdown');
            if (editRegionDropdown && !editRegionDropdown.contains(e.target as Node)) {
                setShowEditRegionDropdown(false);
            }
            const editZoneDropdown = document.getElementById('edit-zone-dropdown');
            if (editZoneDropdown && !editZoneDropdown.contains(e.target as Node)) {
                setShowEditZoneDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [bacentasData, streamsData, regionsData, leadersData, zonesData] = await Promise.all([
                    fetchBacentas(),
                    fetchStreams(),
                    fetchRegions(),
                    fetchLeaders(),
                    fetchZones()
                ]);
                setBacentas(bacentasData);
                setStreams(streamsData);
                setRegions(regionsData);
                setLeaders(leadersData);
                setZones(zonesData);
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

    

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAddBacenta = async () => {
        if (!newBacentaName.trim()) return;
        try {
            setSubmitting(true);
            const payload: { name: string; region_id?: number; leader_id?: number } = { name: newBacentaName.trim() };
            if (selectedRegion) payload.region_id = selectedRegion.id;
            if (selectedLeader) payload.leader_id = selectedLeader.id;
            
            await createBacenta(payload);
            resetModal();
            // Reload bacentas
            const newBacentas = await fetchBacentas();
            setBacentas(newBacentas);
            showToast('Bacenta created successfully!', 'success');
        } catch (err) {
            console.error('Error creating bacenta:', err);
            showToast('Failed to create bacenta. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetModal = () => {
        setNewBacentaName('');
        setSelectedRegion(null);
        setSelectedLeader(null);
        setRegionSearch('');
        setLeaderSearch('');
        setShowRegionDropdown(false);
        setShowLeaderDropdown(false);
        setShowAddModal(false);
        setShowEditModal(false);
        setBacentaToEdit(null);
        setEditName('');
        setSelectedEditRegion(null);
        setEditRegionSearch('');
        setShowEditRegionDropdown(false);
        setSelectedEditZone(null);
        setEditZoneSearch('');
        setShowEditZoneDropdown(false);
    };

    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(regionSearch.toLowerCase())
    );

    const filteredEditRegions = regions.filter(region =>
        region.name.toLowerCase().includes(editRegionSearch.toLowerCase())
    );

    const filteredEditZones = zones.filter(zone =>
        zone.name.toLowerCase().includes(editZoneSearch.toLowerCase())
    );

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase())
    );

    const handleEditClick = (bacenta: Bacenta) => {
        setBacentaToEdit(bacenta);
        setEditName(bacenta.name);
        
        // Find existing region
        if (bacenta.region) {
            const currentRegion = regions.find(r => r.name === bacenta.region?.name);
            if (currentRegion) {
                setSelectedEditRegion(currentRegion);
            } else {
                setSelectedEditRegion(null);
            }
        } else {
            setSelectedEditRegion(null);
        }
        setEditRegionSearch('');
        
        // Find existing leader in the leaders array to pre-select
        if (bacenta.leader) {
            const currentLeader = leaders.find(l => l.name === bacenta.leader?.name);
            if (currentLeader) {
                setSelectedLeader(currentLeader);
            } else {
                setSelectedLeader(null);
            }
        } else {
            setSelectedLeader(null);
        }
        setLeaderSearch('');
        setShowEditModal(true);
        
        // Find existing zone
        if (bacenta.zone) {
            const currentZone = zones.find(z => z.name === bacenta.zone?.name);
            if (currentZone) {
                setSelectedEditZone(currentZone);
            } else {
                setSelectedEditZone(null);
            }
        } else {
            setSelectedEditZone(null);
        }
        setEditZoneSearch('');
    };

    const handleUpdateLeader = async () => {
        if (!bacentaToEdit) return;
        try {
            setSubmitting(true);
            const payload: any = {};
            
            if (editName.trim() && editName.trim() !== bacentaToEdit.name) {
                payload.name = editName.trim();
            }
            
            if (selectedEditRegion) {
                payload.region_id = selectedEditRegion.id;
            } else if (bacentaToEdit.region) {
                payload.region_id = null; // Unassign region
            }
            
            if (selectedEditZone) {
                payload.zone_id = selectedEditZone.id;
            } else if (bacentaToEdit.zone) {
                payload.zone_id = null; // Unassign zone
            }
            
            if (selectedLeader) {
                payload.leader_id = selectedLeader.id;
            } else if (bacentaToEdit.leader) {
                payload.leader_id = null; // Unassign leader
            }
            
            await updateBacenta(bacentaToEdit.id, payload);
            
            // Reload bacentas
            const newBacentas = await fetchBacentas();
            setBacentas(newBacentas);
            showToast('Bacenta updated successfully!', 'success');
            resetModal();
        } catch (err) {
            console.error('Error updating bacenta:', err);
            showToast('Failed to update bacenta. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

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
                                <button className="action-btn" onClick={() => handleEditClick(bacenta)}>
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

            {/* FAB */}
            <button
                className="add-bacenta-fab"
                onClick={() => setShowAddModal(true)}
                aria-label="Add new bacenta"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Add Bacenta Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Bacenta</h3>
                            <button className="modal-close" onClick={resetModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="bacenta-name">Bacenta Name</label>
                                <input
                                    id="bacenta-name"
                                    type="text"
                                    placeholder="Enter bacenta name"
                                    value={newBacentaName}
                                    onChange={(e) => setNewBacentaName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            
                            <div className="form-group" ref={regionDropdownRef}>
                                <label htmlFor="bacenta-region">Region</label>
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
                                            id="bacenta-region"
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
                                <label htmlFor="bacenta-leader">Leader</label>
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
                                            id="bacenta-leader"
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
                                onClick={handleAddBacenta}
                                disabled={!newBacentaName.trim() || submitting}
                            >
                                {submitting ? 'Creating...' : 'Create Bacenta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Bacenta (Modify Leader) Modal */}
            {showEditModal && bacentaToEdit && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Bacenta</h3>
                            <button className="modal-close" onClick={resetModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-description" style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '1rem', opacity: 0.7 }}>
                                Update the bacenta details, assign a new leader to oversee this bacenta and guide its strategic growth within the regional landscape.
                            </p>

                            <div className="form-group">
                                <label htmlFor="edit-bacenta-name">Bacenta Name</label>
                                <input
                                    id="edit-bacenta-name"
                                    type="text"
                                    placeholder="Enter bacenta name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group" id="edit-region-dropdown">
                                <label htmlFor="edit-bacenta-region">Region</label>
                                {selectedEditRegion ? (
                                    <div className="selected-item-chip">
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedEditRegion.name}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedEditRegion(null);
                                                setEditRegionSearch('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="edit-bacenta-region"
                                            type="text"
                                            placeholder="Search for a region..."
                                            value={editRegionSearch}
                                            onChange={(e) => {
                                                setEditRegionSearch(e.target.value);
                                                setShowEditRegionDropdown(true);
                                            }}
                                            onFocus={() => setShowEditRegionDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showEditRegionDropdown && !selectedEditRegion && (
                                    <div className="custom-dropdown">
                                        {filteredEditRegions.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No regions found</p>
                                            </div>
                                        ) : (
                                            filteredEditRegions.slice(0, 8).map((region) => (
                                                <div
                                                    key={region.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedEditRegion(region);
                                                        setEditRegionSearch('');
                                                        setShowEditRegionDropdown(false);
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

                            <div className="form-group" id="edit-zone-dropdown">
                                <label htmlFor="edit-bacenta-zone">Zone</label>
                                {selectedEditZone ? (
                                    <div className="selected-item-chip">
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedEditZone.name}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedEditZone(null);
                                                setEditZoneSearch('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="edit-bacenta-zone"
                                            type="text"
                                            placeholder="Search for a zone..."
                                            value={editZoneSearch}
                                            onChange={(e) => {
                                                setEditZoneSearch(e.target.value);
                                                setShowEditZoneDropdown(true);
                                            }}
                                            onFocus={() => setShowEditZoneDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showEditZoneDropdown && !selectedEditZone && (
                                    <div className="custom-dropdown">
                                        {filteredEditZones.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No zones found</p>
                                            </div>
                                        ) : (
                                            filteredEditZones.slice(0, 8).map((zone) => (
                                                <div
                                                    key={zone.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedEditZone(zone);
                                                        setEditZoneSearch('');
                                                        setShowEditZoneDropdown(false);
                                                    }}
                                                >
                                                    <div className="dropdown-info">
                                                        <span className="dropdown-name">{zone.name}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="edit-bacenta-leader">Current/New Leader</label>
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
                                            id="edit-bacenta-leader"
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
                                onClick={handleUpdateLeader}
                                disabled={submitting}
                            >
                                {submitting ? 'Updating...' : 'Update Bacenta'}
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

export default ManageBacentas;
