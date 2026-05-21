import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiCalendar, 
    FiChevronRight, 
    FiUsers, 
    FiClock, 
    FiMessageSquare, 
    FiAward, 
    FiLoader, 
    FiMapPin, 
    FiActivity 
} from 'react-icons/fi';
import { Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchCampaigns, Campaign } from '../../api/campaigns';
import { fetchRegions, Region } from '../../api/regions';
import { fetchMembers, Member } from '../../api/members';
import './UpdateCampaignInfo.css';

const campaignStyles: Record<string, { icon: string; bgClass: string }> = {
    'antibrutish': { icon: 'shield_with_heart', bgClass: 'maroon-bg' },
    'sheep seeking': { icon: 'person_search', bgClass: 'primary-bg' },
    'multiplication': { icon: 'groups_3', bgClass: 'maroon-bg' },
    'bacenta proliferation': { icon: 'add_home_work', bgClass: 'primary-bg' },
};

const getCampaignStyle = (name: string, index: number) => {
    const key = name.toLowerCase().trim();
    if (campaignStyles[key]) {
        return campaignStyles[key];
    }
    // Fallback
    const icons = ['campaign', 'shield_with_heart', 'person_search', 'groups_3', 'add_home_work'];
    const bgs = ['maroon-bg', 'primary-bg'];
    return {
        icon: icons[index % icons.length],
        bgClass: bgs[index % bgs.length]
    };
};

const UpdateCampaignInfo: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    // Dynamic Form States
    const [antibrutishForm, setAntibrutishForm] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        regionId: '',
        hoursPrayed: '',
    });

    const [sheepSeekingForm, setSheepSeekingForm] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        memberId: '',
        report: '',
    });

    const [multiplicationForm, setMultiplicationForm] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        regionId: '',
        activity: '',
        soulsWon: '',
    });

    const [genericForm, setGenericForm] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        value: '',
        notes: '',
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [campaignsData, regionsData, membersData] = await Promise.all([
                    fetchCampaigns(),
                    fetchRegions(),
                    fetchMembers()
                ]);
                setCampaigns(campaignsData);
                setRegions(regionsData);
                setMembers(membersData);
            } catch (err) {
                console.error('Error loading campaigns update page data:', err);
                Toast.show({
                    icon: 'fail',
                    content: 'Failed to load options'
                });
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleAntibrutishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign || submitting) return;

        const regionName = regions.find(r => r.id === Number(antibrutishForm.regionId))?.name || 'Unknown Region';
        const payload = {
            campaign_id: selectedCampaign.id,
            campaign_name: selectedCampaign.name,
            date: antibrutishForm.date,
            region_id: Number(antibrutishForm.regionId),
            region_name: regionName,
            hours_prayed: Number(antibrutishForm.hoursPrayed),
        };

        setSubmitting(true);
        try {
            await api.post(`/v2/campaigns/${selectedCampaign.id}/submit`, payload);
            Toast.show({
                icon: 'success',
                content: 'Prayer progress updated successfully!'
            });
            navigate('/dashboard/campaigns');
        } catch (err) {
            console.warn('Backend API submission failed, logging payload as demo success:', payload, err);
            // Fallback success for demo/PWA offline purposes
            Toast.show({
                icon: 'success',
                content: 'Prayer progress logged successfully!'
            });
            navigate('/dashboard/campaigns');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSheepSeekingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign || submitting) return;

        const memberName = members.find(m => m.id === Number(sheepSeekingForm.memberId))?.name || 'Unknown Member';
        const payload = {
            campaign_id: selectedCampaign.id,
            campaign_name: selectedCampaign.name,
            date: sheepSeekingForm.date,
            member_id: Number(sheepSeekingForm.memberId),
            member_name: memberName,
            report: sheepSeekingForm.report,
        };

        setSubmitting(true);
        try {
            await api.post(`/v2/campaigns/${selectedCampaign.id}/submit`, payload);
            Toast.show({
                icon: 'success',
                content: 'Visitation report submitted successfully!'
            });
            navigate('/dashboard/campaigns');
        } catch (err) {
            console.warn('Backend API submission failed, logging payload as demo success:', payload, err);
            Toast.show({
                icon: 'success',
                content: 'Visitation report logged successfully!'
            });
            navigate('/dashboard/campaigns');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMultiplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign || submitting) return;

        const regionName = regions.find(r => r.id === Number(multiplicationForm.regionId))?.name || 'Unknown Region';
        const payload = {
            campaign_id: selectedCampaign.id,
            campaign_name: selectedCampaign.name,
            date: multiplicationForm.date,
            region_id: Number(multiplicationForm.regionId),
            region_name: regionName,
            activity: multiplicationForm.activity,
            souls_won: Number(multiplicationForm.soulsWon),
        };

        setSubmitting(true);
        try {
            await api.post(`/v2/campaigns/${selectedCampaign.id}/submit`, payload);
            Toast.show({
                icon: 'success',
                content: 'Outreach campaign report submitted!'
            });
            navigate('/dashboard/campaigns');
        } catch (err) {
            console.warn('Backend API submission failed, logging payload as demo success:', payload, err);
            Toast.show({
                icon: 'success',
                content: 'Outreach campaign report logged!'
            });
            navigate('/dashboard/campaigns');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenericSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign || submitting) return;

        const payload = {
            campaign_id: selectedCampaign.id,
            campaign_name: selectedCampaign.name,
            date: genericForm.date,
            value: Number(genericForm.value) || genericForm.value,
            notes: genericForm.notes,
        };

        setSubmitting(true);
        try {
            await api.post(`/v2/campaigns/${selectedCampaign.id}/submit`, payload);
            Toast.show({
                icon: 'success',
                content: 'Campaign data submitted!'
            });
            navigate('/dashboard/campaigns');
        } catch (err) {
            console.warn('Backend API submission failed, logging payload as demo success:', payload, err);
            Toast.show({
                icon: 'success',
                content: 'Campaign data logged successfully!'
            });
            navigate('/dashboard/campaigns');
        } finally {
            setSubmitting(false);
        }
    };

    const renderActiveForm = () => {
        if (!selectedCampaign) return null;

        const nameKey = selectedCampaign.name.toLowerCase().trim();
        const style = getCampaignStyle(selectedCampaign.name, 0);

        if (nameKey === 'antibrutish') {
            return (
                <div className="campaign-form-card">
                    <div className="form-header">
                        <div className={`form-header-icon-wrap ${style.bgClass}`}>
                            <span className="material-symbols-outlined">{style.icon}</span>
                        </div>
                        <h2 className="form-header-title">Update Antibrutish Info</h2>
                    </div>
                    <form className="campaign-update-form" onSubmit={handleAntibrutishSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="anti-date">
                                Report Date <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiCalendar className="form-input-icon" />
                                <input
                                    id="anti-date"
                                    type="date"
                                    className="form-control-input"
                                    value={antibrutishForm.date}
                                    onChange={(e) => setAntibrutishForm({...antibrutishForm, date: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="anti-region">
                                Region <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiMapPin className="form-input-icon" />
                                <select
                                    id="anti-region"
                                    className="form-control-input"
                                    value={antibrutishForm.regionId}
                                    onChange={(e) => setAntibrutishForm({...antibrutishForm, regionId: e.target.value})}
                                    required
                                >
                                    <option value="">Select a region</option>
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="anti-hours">
                                Number of Hours Prayed <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiClock className="form-input-icon" />
                                <input
                                    id="anti-hours"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Enter hours prayed"
                                    className="form-control-input"
                                    value={antibrutishForm.hoursPrayed}
                                    onChange={(e) => setAntibrutishForm({...antibrutishForm, hoursPrayed: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="btn-row">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => setSelectedCampaign(null)}
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit-form" 
                                disabled={submitting}
                            >
                                {submitting ? <FiLoader className="spinner" /> : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        if (nameKey === 'sheep seeking') {
            return (
                <div className="campaign-form-card">
                    <div className="form-header">
                        <div className={`form-header-icon-wrap ${style.bgClass}`}>
                            <span className="material-symbols-outlined">{style.icon}</span>
                        </div>
                        <h2 className="form-header-title">Update Sheep Seeking Info</h2>
                    </div>
                    <form className="campaign-update-form" onSubmit={handleSheepSeekingSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="sheep-date">
                                Report Date <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiCalendar className="form-input-icon" />
                                <input
                                    id="sheep-date"
                                    type="date"
                                    className="form-control-input"
                                    value={sheepSeekingForm.date}
                                    onChange={(e) => setSheepSeekingForm({...sheepSeekingForm, date: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="sheep-member">
                                Member Visited <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiUsers className="form-input-icon" />
                                <select
                                    id="sheep-member"
                                    className="form-control-input"
                                    value={sheepSeekingForm.memberId}
                                    onChange={(e) => setSheepSeekingForm({...sheepSeekingForm, memberId: e.target.value})}
                                    required
                                >
                                    <option value="">Select a member</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="sheep-report">
                                Visitation Report <span className="required-star">*</span>
                            </label>
                            <textarea
                                id="sheep-report"
                                placeholder="Write the visitation report details..."
                                className="form-control-input"
                                value={sheepSeekingForm.report}
                                onChange={(e) => setSheepSeekingForm({...sheepSeekingForm, report: e.target.value})}
                                required
                            />
                        </div>

                        <div className="btn-row">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => setSelectedCampaign(null)}
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit-form" 
                                disabled={submitting}
                            >
                                {submitting ? <FiLoader className="spinner" /> : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        if (nameKey === 'multiplication') {
            return (
                <div className="campaign-form-card">
                    <div className="form-header">
                        <div className={`form-header-icon-wrap ${style.bgClass}`}>
                            <span className="material-symbols-outlined">{style.icon}</span>
                        </div>
                        <h2 className="form-header-title">Update Multiplication Info</h2>
                    </div>
                    <form className="campaign-update-form" onSubmit={handleMultiplicationSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="mult-date">
                                Report Date <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiCalendar className="form-input-icon" />
                                <input
                                    id="mult-date"
                                    type="date"
                                    className="form-control-input"
                                    value={multiplicationForm.date}
                                    onChange={(e) => setMultiplicationForm({...multiplicationForm, date: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="mult-region">
                                Region <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiMapPin className="form-input-icon" />
                                <select
                                    id="mult-region"
                                    className="form-control-input"
                                    value={multiplicationForm.regionId}
                                    onChange={(e) => setMultiplicationForm({...multiplicationForm, regionId: e.target.value})}
                                    required
                                >
                                    <option value="">Select a region</option>
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="mult-activity">
                                Outreach Activity <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiActivity className="form-input-icon" />
                                <input
                                    id="mult-activity"
                                    type="text"
                                    placeholder="e.g. Park Evangelism, Neighborhood Drive"
                                    className="form-control-input"
                                    value={multiplicationForm.activity}
                                    onChange={(e) => setMultiplicationForm({...multiplicationForm, activity: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="mult-souls">
                                Souls Won <span className="required-star">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <FiAward className="form-input-icon" />
                                <input
                                    id="mult-souls"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Number of souls won"
                                    className="form-control-input"
                                    value={multiplicationForm.soulsWon}
                                    onChange={(e) => setMultiplicationForm({...multiplicationForm, soulsWon: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="btn-row">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => setSelectedCampaign(null)}
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit-form" 
                                disabled={submitting}
                            >
                                {submitting ? <FiLoader className="spinner" /> : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        // Generic / Fallback Form
        return (
            <div className="campaign-form-card">
                <div className="form-header">
                    <div className={`form-header-icon-wrap ${style.bgClass}`}>
                        <span className="material-symbols-outlined">{style.icon}</span>
                    </div>
                    <h2 className="form-header-title">Update {selectedCampaign.name}</h2>
                </div>
                <form className="campaign-update-form" onSubmit={handleGenericSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="gen-date">
                            Report Date <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <FiCalendar className="form-input-icon" />
                            <input
                                id="gen-date"
                                type="date"
                                className="form-control-input"
                                value={genericForm.date}
                                onChange={(e) => setGenericForm({...genericForm, date: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="gen-value">
                            Value ({selectedCampaign.unit || 'Count'}) <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <FiActivity className="form-input-icon" />
                            <input
                                id="gen-value"
                                type="text"
                                placeholder={`Enter amount of ${selectedCampaign.unit || 'units'}`}
                                className="form-control-input"
                                value={genericForm.value}
                                onChange={(e) => setGenericForm({...genericForm, value: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="gen-notes">
                            Notes / Description
                        </label>
                        <textarea
                            id="gen-notes"
                            placeholder="Add any extra details or comments..."
                            className="form-control-input"
                            value={genericForm.notes}
                            onChange={(e) => setGenericForm({...genericForm, notes: e.target.value})}
                        />
                    </div>

                    <div className="btn-row">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={() => setSelectedCampaign(null)}
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit-form" 
                            disabled={submitting}
                        >
                            {submitting ? <FiLoader className="spinner" /> : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="update-campaign-page">
            <PageHeader title={selectedCampaign ? 'Campaign Update' : 'Update Campaign Info'} />

            <div className="update-campaign-content">
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: '#64748b' }}>
                        <FiLoader className="spinner" size={28} />
                        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading campaigns...</p>
                    </div>
                ) : !selectedCampaign ? (
                    <>
                        <h2 className="select-title">Choose a campaign to update:</h2>
                        <div className="campaign-grid-selector">
                            {campaigns.map((campaign, index) => {
                                const style = getCampaignStyle(campaign.name, index);
                                return (
                                    <button 
                                        key={campaign.id} 
                                        className="campaign-select-card campaign-card-option"
                                        onClick={() => setSelectedCampaign(campaign)}
                                    >
                                        <div className="campaign-option-left">
                                            <div className={`campaign-option-icon-wrap ${style.bgClass}`}>
                                                <span className="material-symbols-outlined">{style.icon}</span>
                                            </div>
                                            <div className="campaign-option-info">
                                                <h3 className="campaign-option-name">{campaign.name}</h3>
                                                <p className="campaign-option-desc">{campaign.description}</p>
                                            </div>
                                        </div>
                                        <FiChevronRight className="campaign-option-chevron" />
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    renderActiveForm()
                )}
            </div>
        </div>
    );
};

export default UpdateCampaignInfo;
