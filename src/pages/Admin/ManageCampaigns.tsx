import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { fetchCampaigns, Campaign, fetchShepherdorialCycles, createShepherdorialCycle, updateShepherdorialCycle, ShepherdorialCycle } from '../../api/campaigns';
import './ManageCampaigns.css';
import './AdminShared.css';

const getCampaignIcon = (name: string) => {
    const key = name.toLowerCase().trim();
    if (key === 'antibrutish') return 'shield_with_heart';
    if (key === 'sheep seeking') return 'person_search';
    if (key === 'multiplication') return 'groups_3';
    if (key === 'bacenta proliferation') return 'add_home_work';
    return 'campaign';
};

const ManageCampaigns: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCycleModal, setShowCycleModal] = useState(false);
    const [cycles, setCycles] = useState<ShepherdorialCycle[]>([]);
    const [cycleForm, setCycleForm] = useState({ name: '', cycle_start: '', cycle_end: '' });
    const [editingCycle, setEditingCycle] = useState<ShepherdorialCycle | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const data = await fetchCampaigns();
            setCampaigns(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError('Failed to load campaigns. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const loadCycles = async () => {
        try {
            const data = await fetchShepherdorialCycles();
            setCycles(data);
        } catch (err) {
            console.error('Error fetching cycles:', err);
        }
    };

    const openCycleModal = async () => {
        setShowCycleModal(true);
        resetCycleForm();
        await loadCycles();
    };

    const resetCycleForm = () => {
        setCycleForm({ name: '', cycle_start: '', cycle_end: '' });
        setEditingCycle(null);
    };

    const handleEditCycle = (cycle: ShepherdorialCycle) => {
        setEditingCycle(cycle);
        setCycleForm({
            name: cycle.name,
            cycle_start: dayjs(cycle.cycle_start).format('YYYY-MM-DD'),
            cycle_end: dayjs(cycle.cycle_end).format('YYYY-MM-DD'),
        });
    };

    const handleSaveCycle = async () => {
        if (!cycleForm.name.trim() || !cycleForm.cycle_start || !cycleForm.cycle_end) return;
        try {
            setSubmitting(true);
            if (editingCycle) {
                await updateShepherdorialCycle(editingCycle.id, cycleForm);
                showToast('Cycle updated successfully!', 'success');
            } else {
                await createShepherdorialCycle(cycleForm);
                showToast('Cycle created successfully!', 'success');
            }
            resetCycleForm();
            await Promise.all([loadCycles(), loadCampaigns()]);
        } catch (err) {
            console.error('Error saving cycle:', err);
            showToast('Failed to save cycle. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="manage-campaigns-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-campaigns-container">
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

            <div className="campaigns-content-wrapper">
                <header className="campaigns-header-section">
                    <h2 className="campaigns-title">Manage Campaigns</h2>
                    <p className="campaigns-subtitle">
                        Configure and oversee church campaigns, initiatives, and outreach programs across all regions.
                    </p>
                    <button className="manage-cycles-btn" onClick={openCycleModal}>
                        <span className="material-symbols-outlined">date_range</span>
                        Manage Shepherdorial Cycles
                    </button>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="stats-overview">
                    <div className="stat-card-total">
                        <span className="material-symbols-outlined card-icon">campaign</span>
                        <span className="stat-label">Total Campaigns</span>
                        <span className="stat-value">{String(campaigns.length).padStart(2, '0')}</span>
                    </div>
                </section>

                <div className="campaign-list-header">
                    <div>Campaign</div>
                    <div>Cycle</div>
                    <div>Target</div>
                    <div style={{ textAlign: 'right' }}>Status</div>
                </div>

                <div className="campaign-list">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="campaign-card">
                            <div className="campaign-accent"></div>
                            <div className="campaign-identity">
                                <div className="campaign-icon-box">
                                    <span className="material-symbols-outlined">
                                        {getCampaignIcon(campaign.name)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="campaign-name">{campaign.name}</h3>
                                    <span className="campaign-desc">{campaign.description}</span>
                                </div>
                            </div>

                            <div className="campaign-cycle-info">
                                <span className="campaign-cycle-name">{campaign.shepherdorial_cycle.name}</span>
                                <span className="campaign-cycle-dates">
                                    {dayjs(campaign.shepherdorial_cycle.cycle_start).format('MMM D')} - {dayjs(campaign.shepherdorial_cycle.cycle_end).format('MMM D, YYYY')}
                                </span>
                            </div>

                            <div className="campaign-target-info">
                                <span className="campaign-target-value">{campaign.target}</span>
                                <span className="campaign-target-unit">{campaign.unit}</span>
                            </div>

                            <div className="campaign-actions">
                                <span className={`campaign-status ${campaign.is_active === 1 ? 'active' : 'inactive'}`}>
                                    <span className="status-dot"></span>
                                    {campaign.is_active === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showCycleModal && (
                <div className="modal-overlay" onClick={() => { setShowCycleModal(false); resetCycleForm(); }}>
                    <div className="modal-content cycle-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCycle ? 'Edit Cycle' : 'Manage Shepherdorial Cycles'}</h3>
                            <button className="modal-close" onClick={() => { setShowCycleModal(false); resetCycleForm(); }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="cycle-form">
                                <div className="form-group">
                                    <label>Cycle Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Season of Harvest"
                                        value={cycleForm.name}
                                        onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            value={cycleForm.cycle_start}
                                            onChange={(e) => setCycleForm({ ...cycleForm, cycle_start: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            value={cycleForm.cycle_end}
                                            onChange={(e) => setCycleForm({ ...cycleForm, cycle_end: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="cycle-form-actions">
                                    {editingCycle && (
                                        <button className="btn-cancel" onClick={resetCycleForm}>
                                            Cancel Edit
                                        </button>
                                    )}
                                    <button
                                        className="btn-submit"
                                        onClick={handleSaveCycle}
                                        disabled={!cycleForm.name.trim() || !cycleForm.cycle_start || !cycleForm.cycle_end || submitting}
                                    >
                                        {submitting ? 'Saving...' : editingCycle ? 'Update Cycle' : 'Create Cycle'}
                                    </button>
                                </div>
                            </div>

                            <div className="cycle-divider"></div>

                            <div className="cycle-list-section">
                                <h4 className="cycle-list-title">Existing Cycles</h4>
                                {cycles.length === 0 ? (
                                    <p className="cycle-list-empty">No cycles found. Create one above.</p>
                                ) : (
                                    <div className="cycle-list">
                                        {cycles.map((cycle) => (
                                            <div key={cycle.id} className={`cycle-list-item ${editingCycle?.id === cycle.id ? 'editing' : ''}`}>
                                                <div className="cycle-list-info">
                                                    <span className="cycle-list-name">{cycle.name}</span>
                                                    <span className="cycle-list-dates">
                                                        {dayjs(cycle.cycle_start).format('MMM D, YYYY')} - {dayjs(cycle.cycle_end).format('MMM D, YYYY')}
                                                    </span>
                                                </div>
                                                <button
                                                    className="cycle-edit-btn"
                                                    onClick={() => handleEditCycle(cycle)}
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

export default ManageCampaigns;
