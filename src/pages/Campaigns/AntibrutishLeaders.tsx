import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLoader, FiChevronLeft, FiMapPin } from 'react-icons/fi';
import { Toast } from 'antd-mobile';
import { fetchAntibrutishLeaders, AntibrutishLeader } from '../../api/antibrutish';
import './AntibrutishLeaders.css';

const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const AntibrutishLeaders: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cycleId = (location.state as { cycleId?: number } | null)?.cycleId ?? 1;
    const [leaders, setLeaders] = useState<AntibrutishLeader[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLeaders = async () => {
        try {
            setLoading(true);
            const data = await fetchAntibrutishLeaders(cycleId);
            setLeaders(data);
        } catch (err) {
            console.error('Error fetching antibrutish leaders:', err);
            Toast.show({
                icon: 'fail',
                content: 'Failed to load leaders'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaders();
    }, []);

    const groupedByRegion = leaders.reduce<Record<string, AntibrutishLeader[]>>((acc, leader) => {
        const regionName = leader.region.name;
        if (!acc[regionName]) {
            acc[regionName] = [];
        }
        acc[regionName].push(leader);
        return acc;
    }, {});

    const getRegionTotalHours = (regionLeaders: AntibrutishLeader[]) => {
        return regionLeaders.reduce((sum, l) => sum + Number(l.total_hours_prayed), 0);
    };

    return (
        <div className="antibrutish-leaders-page">
            <div className="antibrutish-leaders-header">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate('/dashboard/campaigns')}>
                        <FiChevronLeft size={24} />
                    </button>
                    <div className="header-title-wrap">
                        <div className="header-icon maroon-bg">
                            <span className="material-symbols-outlined">shield_with_heart</span>
                        </div>
                        <h1 className="header-title">Antibrutish Leaders</h1>
                    </div>
                </div>
            </div>

            <div className="antibrutish-leaders-content">
                {loading ? (
                    <div className="leaders-loading">
                        <FiLoader className="spinner" size={28} />
                        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading leaders...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="leaders-error">
                        <p>No leaders found for this cycle.</p>
                    </div>
                ) : (
                    Object.entries(groupedByRegion).map(([regionName, regionLeaders]) => (
                        <div key={regionName} className="region-group">
                            <div className="region-group-header">
                                <FiMapPin className="region-icon" size={16} />
                                <span className="region-name">{regionName}</span>
                                <span className="region-hours-total">
                                    {getRegionTotalHours(regionLeaders)} hrs
                                </span>
                            </div>
                            {regionLeaders.map((leader, idx) => (
                                <div key={leader.leader_id} className="leader-row">
                                    <span className="leader-rank">{idx + 1}</span>
                                    <div className="leader-initials">
                                        {getInitials(leader.leader.name)}
                                    </div>
                                    <div className="leader-info">
                                        <div className="leader-name">{leader.leader.name}</div>
                                        <div className="leader-email">{leader.leader.email}</div>
                                    </div>
                                    <span className="leader-hours">
                                        {leader.total_hours_prayed} <span className="hours-unit">hrs</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AntibrutishLeaders;
