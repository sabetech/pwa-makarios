import React, { useState, useEffect, useMemo } from 'react';
import { FiBell, FiSearch, FiDownload, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import dayjs from 'dayjs';
import { fetchCampaigns, Campaign } from '../../api/campaigns';
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
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await fetchCampaigns();
                setCampaigns(data);
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
            case 'antibrutish':
                return (
                    <div className="initiative-progress">
                        <div className="progress-bar-container">
                            <div className="progress-bar maroon" style={{ width: '60%' }}></div>
                        </div>
                        <span className="progress-label">{Math.round(campaign.target * 0.6)} {campaign.unit}</span>
                    </div>
                );
            case 'sheep seeking':
                return (
                    <div className="initiative-metric">
                        <FiTrendingUp className="metric-icon" />
                        <span>{Math.round(campaign.target * 0.9)} New {campaign.unit} Registered</span>
                    </div>
                );
            case 'multiplication':
                return (
                    <div className="initiative-footer">
                        <span className="target-label">Target: {campaign.target} {campaign.unit}</span>
                        <button className="text-link">View Details</button>
                    </div>
                );
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
                                    <div className="initiative-card" key={campaign.id}>
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

                                            <div className="campaign-cycle" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FiCalendar size={14} />
                                                <span>Cycle: {dayjs(campaign.cycle_start).format('MMM D, YYYY')} - {dayjs(campaign.cycle_end).format('MMM D, YYYY')}</span>
                                            </div>
                                        </div>
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
