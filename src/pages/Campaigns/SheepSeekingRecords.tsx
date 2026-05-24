import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLoader, FiChevronLeft, FiMapPin, FiCalendar } from 'react-icons/fi';
import { Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { fetchSheepSeekingRecords, SheepSeekingRecord } from '../../api/sheep-seeking';
import './SheepSeekingRecords.css';

const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const SheepSeekingRecords: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cycleId = (location.state as { cycleId?: number } | null)?.cycleId ?? 1;
    const [records, setRecords] = useState<SheepSeekingRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const data = await fetchSheepSeekingRecords(cycleId);
            setRecords(data);
        } catch (err) {
            console.error('Error fetching sheep seeking records:', err);
            Toast.show({
                icon: 'fail',
                content: 'Failed to load records'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const groupedByRegion = records.reduce<Record<string, SheepSeekingRecord[]>>((acc, record) => {
        const regionName = record.leader.region?.name ?? 'Unassigned';
        if (!acc[regionName]) {
            acc[regionName] = [];
        }
        acc[regionName].push(record);
        return acc;
    }, {});

    return (
        <div className="sheep-seeking-page">
            <div className="sheep-seeking-header">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate('/dashboard/campaigns')}>
                        <FiChevronLeft size={24} />
                    </button>
                    <div className="header-title-wrap">
                        <div className="header-icon primary-bg">
                            <span className="material-symbols-outlined">person_search</span>
                        </div>
                        <h1 className="header-title">Sheep Seeking Records</h1>
                    </div>
                </div>
            </div>

            <div className="sheep-seeking-content">
                {loading ? (
                    <div className="ss-loading">
                        <FiLoader className="spinner" size={28} />
                        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading records...</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="ss-error">
                        <p>No sheep seeking records found for this cycle.</p>
                    </div>
                ) : (
                    Object.entries(groupedByRegion).map(([regionName, regionRecords]) => (
                        <div key={regionName} className="ss-region-group">
                            <div className="ss-region-header">
                                <FiMapPin className="region-icon" size={16} />
                                <span className="region-name">{regionName}</span>
                                <span className="region-count">{regionRecords.length}</span>
                            </div>
                            {regionRecords.map((record) => (
                                <div key={record.id} className="ss-record-row">
                                    {record.member_visited.img_url ? (
                                        <img src={record.member_visited.img_url} alt={record.member_visited.name} className="ss-record-avatar" />
                                    ) : (
                                        <div className="ss-record-initials">
                                            {getInitials(record.member_visited.name)}
                                        </div>
                                    )}
                                    <div className="ss-record-info">
                                        <div className="ss-record-member">{record.member_visited.name}</div>
                                        <div className="ss-record-meta">
                                            <FiCalendar size={12} />
                                            <span>{dayjs(record.date).format('MMM D, YYYY')}</span>
                                        </div>
                                        <div className="ss-record-leader">
                                            Leader: {record.leader.name}
                                        </div>
                                        <div className="ss-record-report">{record.visitation_report}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SheepSeekingRecords;
