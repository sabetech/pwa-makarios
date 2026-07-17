import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRegion, fetchRegions, fetchRegionBacentas, Region, RegionBacenta, RegionMember } from '../../api/regions';
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
                                    <div className="bacenta-card-metrics">
                                        <div className="bacenta-metric">
                                            <span className="metric-num">{bacenta.members_count}</span>
                                            <span className="metric-lbl">Members</span>
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
        </div>
    );
};

export default RegionDetails;
