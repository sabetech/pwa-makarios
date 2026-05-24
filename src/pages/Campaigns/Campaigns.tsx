import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiDownload, FiCalendar, FiChevronRight } from 'react-icons/fi';
import dayjs from 'dayjs';
import { fetchCampaigns, Campaign } from '../../api/campaigns';
import { fetchAntibrutishTotalHours } from '../../api/antibrutish';
import { fetchSheepSeekingTotalVisits } from '../../api/sheep-seeking';
import { fetchMultiplicationTotalSouls } from '../../api/multiplication-campaigns';
import './Campaigns.css';

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
    // Fallback: alternate icons and backgrounds
    const icons = ['campaign', 'shield_with_heart', 'person_search', 'groups_3', 'add_home_work'];
    const bgs = ['maroon-bg', 'primary-bg'];
    return {
        icon: icons[index % icons.length],
        bgClass: bgs[index % bgs.length]
    };
};

const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [antibrutishHours, setAntibrutishHours] = useState<number>(0);
    const [sheepSeekingVisits, setSheepSeekingVisits] = useState<number>(0);
    const [multiplicationSouls, setMultiplicationSouls] = useState<number>(0);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await fetchCampaigns();
                setCampaigns(data);
                const [hours, visits, souls] = await Promise.all([
                    fetchAntibrutishTotalHours(1),
                    fetchSheepSeekingTotalVisits(1),
                    fetchMultiplicationTotalSouls(1),
                ]);
                setAntibrutishHours(hours);
                setSheepSeekingVisits(visits);
                setMultiplicationSouls(souls);
            } catch (err) {
                console.error('Error fetching campaigns:', err);
                setError('Failed to load campaigns. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
    }, []);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [campaigns, searchQuery]);

    const renderCampaignTarget = (campaign: Campaign) => {
        const nameKey = campaign.name.toLowerCase().trim();
        
        switch (nameKey) {
            case 'antibrutish': {
                const pct = campaign.target > 0 ? Math.min((antibrutishHours / campaign.target) * 100, 100) : 0;
                return (
                    <div className="initiative-progress">
                        <div className="progress-bar-container">
                            <div className="progress-bar maroon" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="progress-label">{antibrutishHours} / {campaign.target} {campaign.unit}</span>
                    </div>
                );
            }
            case 'sheep seeking': {
                const pct = campaign.target > 0 ? Math.min((sheepSeekingVisits / campaign.target) * 100, 100) : 0;
                return (
                    <div className="initiative-progress">
                        <div className="progress-bar-container">
                            <div className="progress-bar primary" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="progress-label">{sheepSeekingVisits} / {campaign.target} {campaign.unit}</span>
                    </div>
                );
            }
            case 'multiplication': {
                const pct = campaign.target > 0 ? Math.min((multiplicationSouls / campaign.target) * 100, 100) : 0;
                return (
                    <div className="initiative-progress">
                        <div className="progress-bar-container">
                            <div className="progress-bar primary" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="progress-label">{multiplicationSouls} / {campaign.target} {campaign.unit}</span>
                    </div>
                );
            }
            case 'bacenta proliferation':
                return (
                    <div className="initiative-stats">
                        <span className="stat-label">Target {campaign.unit}:</span>
                        <span className="stat-value">{campaign.target} New</span>
                    </div>
                );
            default:
                return (
                    <div className="initiative-stats">
                        <span className="stat-label">Target / Goal:</span>
                        <span className="stat-value">{campaign.target} {campaign.unit}</span>
                    </div>
                );
        }
    };

    return (
        <div className="campaigns-page">
            <header className="campaigns-header">
                <div className="header-top">
                    <div className="header-title-container">
                        <span className="material-symbols-outlined campaign-icon">campaign</span>
                        <h1 className="page-title">Campaigns</h1>
                    </div>
                    <button className="icon-btn">
                        <FiBell />
                    </button>
                </div>
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search initiatives..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <main className="campaigns-content">
                <section>
                    <h2 className="section-label">Active Initiatives</h2>
                    
                    {error && (
                        <div className="error-container" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#ef4444' }}>
                            <p>{error}</p>
                        </div>
                    )}

                    {!error && !loading && filteredCampaigns.length === 0 && (
                        <div className="empty-container" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                            <p>No initiatives found matching your search.</p>
                        </div>
                    )}

                    <div className="initiatives-grid">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div className="initiative-card skeleton-card" key={i} style={{ opacity: 0.6 }}>
                                    <div className="initiative-icon-container" style={{ backgroundColor: '#e2e8f0', width: '3rem', height: '3rem', borderRadius: '0.5rem' }} />
                                    <div className="initiative-details" style={{ flex: 1 }}>
                                        <div className="initiative-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div className="skeleton-text" style={{ backgroundColor: '#e2e8f0', height: '1.25rem', width: '40%', borderRadius: '4px' }} />
                                            <div className="skeleton-text" style={{ backgroundColor: '#e2e8f0', height: '1rem', width: '15%', borderRadius: '9999px' }} />
                                        </div>
                                        <div className="skeleton-text" style={{ backgroundColor: '#e2e8f0', height: '0.875rem', width: '80%', borderRadius: '4px', marginBottom: '0.5rem' }} />
                                        <div className="skeleton-text" style={{ backgroundColor: '#e2e8f0', height: '0.75rem', width: '60%', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredCampaigns.map((campaign, index) => {
                                const style = getCampaignStyle(campaign.name, index);
                                return (
                                    <div
                                        className="initiative-card"
                                        key={campaign.id}
                                        onClick={() => {
                                            const key = campaign.name.toLowerCase().trim();
                                            const cycleId = campaign.shepherdorial_cycle.id;
                                            if (key === 'antibrutish') {
                                                navigate('/dashboard/campaigns/antibrutish', { state: { cycleId } });
                                            } else if (key === 'sheep seeking') {
                                                navigate('/dashboard/campaigns/sheep-seeking', { state: { cycleId } });
                                            } else {
                                                navigate('/dashboard/campaigns/update');
                                            }
                                        }}
                                    >
                                        <div className={`initiative-icon-container ${style.bgClass}`}>
                                            <span className="material-symbols-outlined">{style.icon}</span>
                                        </div>
                                        <div className="initiative-details">
                                            <div className="initiative-header">
                                                <h3 className="initiative-name">{campaign.name}</h3>
                                                <span className={`status-badge ${campaign.is_active === 1 ? 'active' : 'progress'}`}>
                                                    {campaign.is_active === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="initiative-description">{campaign.description}</p>
                                            
                                            {renderCampaignTarget(campaign)}

                                            <div className="campaign-cycle">
                                                <FiCalendar size={14} />
                                                <span>{campaign.shepherdorial_cycle.name}: {dayjs(campaign.shepherdorial_cycle.cycle_start).format('MMM D, YYYY')} - {dayjs(campaign.shepherdorial_cycle.cycle_end).format('MMM D, YYYY')}</span>
                                            </div>
                                        </div>
                                        <FiChevronRight className="campaign-card-chevron" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                <div className="reports-banner">
                    <div className="banner-content">
                        <h4 className="banner-title">Campaign Reports</h4>
                        <p className="banner-text">Download the latest analysis of all active church initiatives.</p>
                        <button className="banner-btn">
                            <FiDownload /> Get Monthly PDF
                        </button>
                    </div>
                    <span className="material-symbols-outlined banner-bg-icon">analytics</span>
                </div>
            </main>
        </div>
    );
};

export default Campaigns;
