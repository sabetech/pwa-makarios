import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRegion, fetchRegions, fetchRegionBacentas, Region, RegionBacenta, RegionMember } from '../../api/regions';
import { createBacenta, updateBacenta, deleteBacenta } from '../../api/bacentas';
import { fetchLeaders, Leader } from '../../api/leaders';
import { fetchZones, Zone } from '../../api/zones';
import './RegionDetails.css';
import './AdminShared.css';

const RegionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeList, setActiveList] = useState<'bacentas' | 'members' | null>(null);
    const [bacentaList, setBacentaList] = useState<RegionBacenta[]>([]);
    const [bacentaLoading, setBacentaLoading] = useState(false);

    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bacentaToEdit, setBacentaToEdit] = useState<RegionBacenta | null>(null);
    const [newBacentaName, setNewBacentaName] = useState('');
    const [editName, setEditName] = useState('');

    const [leaderSearch, setLeaderSearch] = useState('');
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);

    const [zoneSearch, setZoneSearch] = useState('');
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [showZoneDropdown, setShowZoneDropdown] = useState(false);

    const [editLeaderSearch, setEditLeaderSearch] = useState('');
    const [selectedEditLeader, setSelectedEditLeader] = useState<Leader | null>(null);
    const [showEditLeaderDropdown, setShowEditLeaderDropdown] = useState(false);

    const [editZoneSearch, setEditZoneSearch] = useState('');
    const [selectedEditZone, setSelectedEditZone] = useState<Zone | null>(null);
    const [showEditZoneDropdown, setShowEditZoneDropdown] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [bacentaToDelete, setBacentaToDelete] = useState<RegionBacenta | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const leaderDropdownRef = useRef<HTMLDivElement>(null);
    const zoneDropdownRef = useRef<HTMLDivElement>(null);
    const editLeaderDropdownRef = useRef<HTMLDivElement>(null);
    const editZoneDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (leaderDropdownRef.current && !leaderDropdownRef.current.contains(e.target as Node)) {
                setShowLeaderDropdown(false);
            }
            if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(e.target as Node)) {
                setShowZoneDropdown(false);
            }
            if (editLeaderDropdownRef.current && !editLeaderDropdownRef.current.contains(e.target as Node)) {
                setShowEditLeaderDropdown(false);
            }
            if (editZoneDropdownRef.current && !editZoneDropdownRef.current.contains(e.target as Node)) {
                setShowEditZoneDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadRegionData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                let regionData: Region;
                try {
                    regionData = await fetchRegion(id);
                } catch (e) {
                    const allRegions = await fetchRegions();
                    const found = allRegions.find(r => String(r.id) === String(id));
                    if (!found) throw new Error("Region not found");
                    regionData = found;
                }
                setRegion(regionData);
                setError(null);
            } catch (err) {
                console.error("Error loading region details:", err);
                setError("Failed to load region details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadRegionData();
    }, [id]);

    useEffect(() => {
        const loadLeadersAndZones = async () => {
            try {
                const [leadersData, zonesData] = await Promise.all([
                    fetchLeaders(),
                    fetchZones()
                ]);
                setLeaders(leadersData);
                setZones(zonesData);
            } catch (err) {
                console.error('Error loading leaders/zones:', err);
            }
        };
        loadLeadersAndZones();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleToggleBacentas = async () => {
        if (activeList === 'bacentas') {
            setActiveList(null);
            return;
        }
        if (!id) return;
        setBacentaLoading(true);
        try {
            const data = await fetchRegionBacentas(id);
            setBacentaList(data);
            setActiveList('bacentas');
        } catch (err) {
            console.error("Error loading bacentas:", err);
        } finally {
            setBacentaLoading(false);
        }
    };

    const handleToggleMembers = () => {
        if (activeList === 'members') {
            setActiveList(null);
        } else {
            setActiveList('members');
        }
    };

    const refreshBacentas = async () => {
        if (!id) return;
        try {
            const data = await fetchRegionBacentas(id);
            setBacentaList(data);
        } catch (err) {
            console.error("Error refreshing bacentas:", err);
        }
    };

    const handleAddBacenta = async () => {
        if (!newBacentaName.trim() || !id) return;
        try {
            setSubmitting(true);
            const payload: { name: string; region_id: number; leader_id?: number; zone_id?: number } = {
                name: newBacentaName.trim(),
                region_id: Number(id)
            };
            if (selectedLeader) payload.leader_id = selectedLeader.id;
            if (selectedZone) payload.zone_id = selectedZone.id;
            await createBacenta(payload);
            resetModal();
            await refreshBacentas();
            showToast('Bacenta created successfully!', 'success');
        } catch (err) {
            console.error('Error creating bacenta:', err);
            showToast('Failed to create bacenta. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (bacenta: RegionBacenta) => {
        setBacentaToEdit(bacenta);
        setEditName(bacenta.name);

        if (bacenta.leader) {
            const currentLeader = leaders.find(l => l.name === bacenta.leader?.name);
            setSelectedEditLeader(currentLeader || null);
        } else {
            setSelectedEditLeader(null);
        }
        setEditLeaderSearch('');

        setSelectedEditZone(null);
        setEditZoneSearch('');
        setShowEditModal(true);
    };

    const handleUpdateBacenta = async () => {
        if (!bacentaToEdit) return;
        try {
            setSubmitting(true);
            const payload: any = {};
            if (editName.trim() && editName.trim() !== bacentaToEdit.name) {
                payload.name = editName.trim();
            }
            if (selectedEditLeader) {
                payload.leader_id = selectedEditLeader.id;
            } else if (bacentaToEdit.leader) {
                payload.leader_id = null;
            }
            if (selectedEditZone) {
                payload.zone_id = selectedEditZone.id;
            }
            await updateBacenta(bacentaToEdit.id, payload);
            await refreshBacentas();
            showToast('Bacenta updated successfully!', 'success');
            resetModal();
        } catch (err) {
            console.error('Error updating bacenta:', err);
            showToast('Failed to update bacenta. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = (bacenta: RegionBacenta) => {
        setBacentaToDelete(bacenta);
        setDeleteModalVisible(true);
    };

    const performDelete = async () => {
        if (!bacentaToDelete) return;
        try {
            setIsDeleting(true);
            await deleteBacenta(bacentaToDelete.id);
            setBacentaList(prev => prev.filter(b => b.id !== bacentaToDelete.id));
            showToast('Bacenta deleted successfully.', 'success');
            setDeleteModalVisible(false);
            setBacentaToDelete(null);
        } catch (err) {
            console.error('Error deleting bacenta:', err);
            showToast('Failed to delete bacenta.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const resetModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setBacentaToEdit(null);
        setNewBacentaName('');
        setEditName('');
        setSelectedLeader(null);
        setSelectedZone(null);
        setSelectedEditLeader(null);
        setSelectedEditZone(null);
        setLeaderSearch('');
        setZoneSearch('');
        setEditLeaderSearch('');
        setEditZoneSearch('');
        setShowLeaderDropdown(false);
        setShowZoneDropdown(false);
        setShowEditLeaderDropdown(false);
        setShowEditZoneDropdown(false);
    };

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase())
    );
    const filteredZones = zones.filter(zone =>
        zone.name.toLowerCase().includes(zoneSearch.toLowerCase())
    );
    const filteredEditLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(editLeaderSearch.toLowerCase())
    );
    const filteredEditZones = zones.filter(zone =>
        zone.name.toLowerCase().includes(editZoneSearch.toLowerCase())
    );

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
        return (
            <div className="region-details-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading region details...</p>
                </div>
            </div>
        );
    }

    if (error || !region) {
        return (
            <div className="region-details-container flex items-center justify-center">
                <div className="text-center p-6 bg-error-container text-on-error-container rounded-lg max-w-md mx-4">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <p className="mb-4">{error || "Region details not found."}</p>
                    <button className="btn-cancel" onClick={() => navigate('/dashboard/admin/regions')}>
                        Back to Regions
                    </button>
                </div>
            </div>
        );
    }

    const bacentasCount = region.bacentas?.length ?? region.bacenta_count;

    return (
        <div className="region-details-container">
            <header className="admin-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/dashboard/admin/regions')}>
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

            <div className="region-details-wrapper">
                <header className="details-header-section">
                    <div className="header-title-row">
                        <div className="region-avatar-badge">
                            <span className="material-symbols-outlined">explore</span>
                        </div>
                        <div>
                            <span className="stream-badge-large">{region.stream?.name || 'General Stream'}</span>
                            <h2 className="region-details-title">{region.name}</h2>
                        </div>
                    </div>
                </header>

                <div className="details-grid">
                    <div className="details-card leader-card-details">
                        <h3 className="card-section-title">Regional Leader</h3>
                        <div className="leader-profile-info">
                            {region.leader?.img_url ? (
                                <img src={region.leader.img_url} alt={region.leader.name} className="details-leader-avatar" />
                            ) : (
                                <div className="details-leader-initials">{getInitials(region.leader?.name || "")}</div>
                            )}
                            <div>
                                <h4 className="details-leader-name">{region.leader?.name || "No Leader Assigned"}</h4>
                                <p className="details-leader-role">Regional Overseer</p>
                            </div>
                        </div>
                    </div>

                    <div className="details-card stats-summary-card">
                        <h3 className="card-section-title">Stats: tap to show detail</h3>
                        <div className="details-stats-row">
                            <div
                                className={`details-stat-box clickable ${activeList === 'bacentas' ? 'active' : ''}`}
                                onClick={handleToggleBacentas}
                            >
                                <span className="stat-value-large">{bacentasCount}</span>
                                <span className="stat-label-small">
                                    {bacentaLoading ? 'Loading...' : 'Bacentas'}
                                </span>
                            </div>
                            <div
                                className={`details-stat-box clickable ${activeList === 'members' ? 'active' : ''}`}
                                onClick={handleToggleMembers}
                            >
                                <span className="stat-value-large">{region.members_through?.length}</span>
                                <span className="stat-label-small">Total Members</span>
                            </div>
                        </div>
                    </div>
                </div>

                {activeList === 'bacentas' && bacentaList.length === 0 && !bacentaLoading && (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">domain_disabled</span>
                        <p>No active bacentas registered in this region.</p>
                    </div>
                )}

                {activeList === 'bacentas' && bacentaLoading && (
                    <div className="inline-loading">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p>Loading bacentas...</p>
                    </div>
                )}

                {activeList === 'bacentas' && !bacentaLoading && bacentaList.length > 0 && (
                    <section className="details-list-section">
                        <div className="section-header-row">
                            <h3 className="section-title">Bacentas in {region.name}</h3>
                            <span className="badge-count">{bacentaList.length} Bacentas</span>
                        </div>
                        <div className="bacentas-grid-list">
                            {bacentaList.map((bacenta) => (
                                <div key={bacenta.id} className="bacenta-summary-card">
                                    <div className="bacenta-card-accent"></div>
                                    <div className="bacenta-header">
                                        <h4 className="bacenta-card-title">{bacenta.name}</h4>
                                        <div className="bacenta-leader-row">
                                            {bacenta.leader?.img_url ? (
                                                <img src={bacenta.leader.img_url} alt={bacenta.leader.name} className="bacenta-leader-img" />
                                            ) : (
                                                <div className="bacenta-leader-initials">{getInitials(bacenta.leader?.name || "")}</div>
                                            )}
                                            <span className="bacenta-leader-name">{bacenta.leader?.name || "No Leader Assigned"}</span>
                                        </div>
                                    </div>
                                    <div className="bacenta-card-footer">
                                        <div className="bacenta-card-metrics">
                                            <div className="bacenta-metric">
                                                <span className="metric-num">{bacenta.members_count}</span>
                                                <span className="metric-lbl">Members</span>
                                            </div>
                                        </div>
                                        <div className="bacenta-card-actions">
                                            <button className="action-btn" onClick={() => handleEditClick(bacenta)}>
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="action-btn delete" onClick={() => confirmDelete(bacenta)}>
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeList === 'members' && (region.members_through?.length ?? 0) === 0 && (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">people_outline</span>
                        <p>No member records found for this region.</p>
                    </div>
                )}

                {activeList === 'members' && region.members_through && region.members_through.length > 0 && (
                    <section className="details-list-section">
                        <div className="section-header-row">
                            <h3 className="section-title">Members in {region.name}</h3>
                            <span className="badge-count">{region.members_through.length} Members</span>
                        </div>
                        <div className="bacentas-grid-list">
                            {region.members_through.map((member) => (
                                <div key={member.id} className="bacenta-summary-card">
                                    <div className="bacenta-card-accent"></div>
                                    <div className="bacenta-header">
                                        <div className="bacenta-leader-row">
                                            {member.img_url ? (
                                                <img src={member.img_url} alt={member.name} className="bacenta-leader-img" />
                                            ) : (
                                                <div className="bacenta-leader-initials">{getInitials(member.name)}</div>
                                            )}
                                            <div>
                                                <h4 className="bacenta-card-title" style={{ margin: 0 }}>{member.name}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bacenta-card-metrics">
                                        <div className="bacenta-metric">
                                            <span className="metric-lbl">{member.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* FAB */}
            <button
                className="add-bacenta-fab"
                onClick={() => setShowAddModal(true)}
                aria-label="Add bacenta to region"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Add Bacenta Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Bacenta to {region.name}</h3>
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

                            <div className="form-group" ref={leaderDropdownRef}>
                                <label htmlFor="bacenta-leader">Leader (Optional)</label>
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

                            <div className="form-group" ref={zoneDropdownRef}>
                                <label htmlFor="bacenta-zone">Zone (Optional)</label>
                                {selectedZone ? (
                                    <div className="selected-item-chip">
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedZone.name}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedZone(null);
                                                setZoneSearch('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="search-wrapper">
                                        <span className="material-symbols-outlined search-icon">search</span>
                                        <input
                                            id="bacenta-zone"
                                            type="text"
                                            placeholder="Search for a zone..."
                                            value={zoneSearch}
                                            onChange={(e) => {
                                                setZoneSearch(e.target.value);
                                                setShowZoneDropdown(true);
                                            }}
                                            onFocus={() => setShowZoneDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showZoneDropdown && !selectedZone && (
                                    <div className="custom-dropdown">
                                        {filteredZones.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No zones found</p>
                                            </div>
                                        ) : (
                                            filteredZones.slice(0, 8).map((zone) => (
                                                <div
                                                    key={zone.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedZone(zone);
                                                        setZoneSearch('');
                                                        setShowZoneDropdown(false);
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

            {/* Edit Bacenta Modal */}
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

                            <div className="form-group" ref={editLeaderDropdownRef}>
                                <label htmlFor="edit-bacenta-leader">Leader (Optional)</label>
                                {selectedEditLeader ? (
                                    <div className="selected-item-chip">
                                        {selectedEditLeader.img_url ? (
                                            <img src={selectedEditLeader.img_url} alt={selectedEditLeader.name} className="chip-avatar" />
                                        ) : (
                                            <div className="chip-initials">{getInitials(selectedEditLeader.name)}</div>
                                        )}
                                        <div className="chip-info">
                                            <span className="chip-name">{selectedEditLeader.name}</span>
                                            <span className="chip-role">{selectedEditLeader.role}</span>
                                        </div>
                                        <button
                                            className="chip-remove"
                                            onClick={() => {
                                                setSelectedEditLeader(null);
                                                setEditLeaderSearch('');
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
                                            value={editLeaderSearch}
                                            onChange={(e) => {
                                                setEditLeaderSearch(e.target.value);
                                                setShowEditLeaderDropdown(true);
                                            }}
                                            onFocus={() => setShowEditLeaderDropdown(true)}
                                        />
                                    </div>
                                )}
                                {showEditLeaderDropdown && !selectedEditLeader && (
                                    <div className="custom-dropdown">
                                        {filteredEditLeaders.length === 0 ? (
                                            <div className="dropdown-empty">
                                                <p>No leaders found</p>
                                            </div>
                                        ) : (
                                            filteredEditLeaders.slice(0, 8).map((leader) => (
                                                <div
                                                    key={leader.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedEditLeader(leader);
                                                        setEditLeaderSearch('');
                                                        setShowEditLeaderDropdown(false);
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

                            <div className="form-group" ref={editZoneDropdownRef}>
                                <label htmlFor="edit-bacenta-zone">Zone (Optional)</label>
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
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={resetModal}>Cancel</button>
                            <button
                                className="btn-submit"
                                onClick={handleUpdateBacenta}
                                disabled={submitting}
                            >
                                {submitting ? 'Updating...' : 'Update Bacenta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalVisible && bacentaToDelete && (
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
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Are you sure you want to delete the bacenta <strong>{bacentaToDelete.name}</strong>?</p>
                            <p className="delete-subtext" style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModalVisible(false)} disabled={isDeleting}>Cancel</button>
                            <button
                                className="btn-submit"
                                style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)', borderColor: 'transparent' }}
                                onClick={performDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Bacenta'}
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

export default RegionDetails;
