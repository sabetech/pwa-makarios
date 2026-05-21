import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiDollarSign, FiChevronRight, FiChevronDown, FiLoader } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchBacentaServices } from '../../api/services';
import { fetchBacentas, Bacenta } from '../../api/bacentas';
import './BacentaServicesList.css';

const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const generateWeekOptions = (): { value: string; label: string }[] => {
    const options: { value: string; label: string }[] = [];
    const today = dayjs();
    const currentSunday = today.startOf('week');

    for (let i = 0; i < 8; i++) {
        const weekStart = currentSunday.subtract(i, 'week');
        const weekEnd = weekStart.add(6, 'day');

        const startMonth = weekStart.format('MMM');
        const endMonth = weekEnd.format('MMM');

        const startDay = getOrdinal(weekStart.date());
        const endDay = getOrdinal(weekEnd.date());

        const label = startMonth === endMonth
            ? `${startMonth} ${startDay} - ${endDay}`
            : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

        const weekStartStr = weekStart.format('YYYY-MM-DD');
        options.push({ value: weekStartStr, label });
    }

    return options;
};

const weekOptions = generateWeekOptions();

const BacentaServicesList: React.FC = () => {
    const navigate = useNavigate();
    const [selectedWeek, setSelectedWeek] = useState<string>(weekOptions[0].value);
    const [services, setServices] = useState<any[]>([]);
    const [bacentas, setBacentas] = useState<Bacenta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                const fromDate = selectedWeek;
                const toDate = dayjs(selectedWeek).add(6, 'day').format('YYYY-MM-DD');

                const [servicesData, bacentasData] = await Promise.all([
                    fetchBacentaServices(fromDate, toDate),
                    fetchBacentas()
                ]);

                setServices(servicesData);
                setBacentas(bacentasData);
            } catch (err) {
                console.error('Error fetching services data:', err);
                setError('Failed to load services. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedWeek]);

    const formatOffering = (offering: any) => {
        if (offering === undefined || offering === null) return 'GHc 0.00';
        const amountNum = typeof offering === 'number' ? offering : parseFloat(offering);
        return isNaN(amountNum) ? String(offering) : `GHc ${amountNum.toFixed(2)}`;
    };

    const filteredServices = useMemo(() => {
        // Map of bacenta id to the service for this week
        const serviceMap = new Map<number, any>();
        services.forEach(service => {
            if (service.bacenta_id) {
                serviceMap.set(Number(service.bacenta_id), service);
            }
        });

        // Generate a list of all bacentas, incorporating their service if it exists
        return bacentas.map(bacenta => {
            const service = serviceMap.get(bacenta.id);
            if (service) {
                return {
                    id: service.id,
                    bacentaName: bacenta.name,
                    region: bacenta.region?.name || 'Unknown Region',
                    date: service.service_date ? dayjs(service.service_date).format('MMM D, YYYY') : (service.date ? dayjs(service.date).format('MMM D, YYYY') : 'Unknown Date'),
                    attendance: Number(service.attendance) || 0,
                    offering: formatOffering(service.offering),
                    status: 'submitted' as const
                };
            } else {
                return {
                    id: -bacenta.id, // negative id to avoid key conflicts
                    bacentaName: bacenta.name,
                    region: bacenta.region?.name || 'Unknown Region',
                    date: 'Not Submitted',
                    attendance: 0,
                    offering: 'GHc 0.00',
                    status: 'pending' as const
                };
            }
        });
    }, [services, bacentas]);

    const groupedServices = useMemo(() => {
        return filteredServices.reduce((acc, service) => {
            const region = service.region;
            if (!acc[region]) {
                acc[region] = [];
            }
            acc[region].push(service);
            return acc;
        }, {} as Record<string, typeof filteredServices[0][]>);
    }, [filteredServices]);

    const regions = useMemo(() => {
        return Object.keys(groupedServices).sort();
    }, [groupedServices]);

    const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

    // Keep newly loaded regions expanded by default
    useEffect(() => {
        if (regions.length > 0) {
            setExpandedRegions(prev => {
                const next = { ...prev };
                regions.forEach(region => {
                    if (next[region] === undefined) {
                        next[region] = true;
                    }
                });
                return next;
            });
        }
    }, [regions]);

    const toggleRegion = (region: string) => {
        setExpandedRegions(prev => ({
            ...prev,
            [region]: !prev[region]
        }));
    };

    const handleServiceTap = (service: typeof filteredServices[0]) => {
        if (service.status === 'pending') {
            const bacentaId = Math.abs(service.id);
            navigate('/dashboard/bacenta-service', {
                state: {
                    bacentaId,
                    bacentaName: service.bacentaName,
                    serviceTypeId: '3'
                }
            });
        } else {
            console.log('Tapped submitted service:', service.id);
        }
    };

    return (
        <div className="bacenta-list-page">
            <PageHeader title="Bacenta Services" />

            <div className="bacenta-list-content">
                {/* Week Selector */}
                <div className="week-selector">
                    <select
                        className="week-dropdown"
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        disabled={loading}
                    >
                        {weekOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary Stats */}
                <div className="bacenta-stats-row">
                    <div className="bacenta-stat-card">
                        <span className="stat-value">
                            {loading ? '...' : filteredServices.filter(s => s.status === 'submitted').length}
                        </span>
                        <span className="stat-label">Total Services</span>
                    </div>
                    <div className="bacenta-stat-card">
                        <span className="stat-value">
                            {loading ? '...' : filteredServices.reduce((sum, s) => sum + s.attendance, 0)}
                        </span>
                        <span className="stat-label">Total Attendance</span>
                    </div>
                </div>

                {/* Services List */}
                <div className="bacenta-services-list">
                    {loading ? (
                        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: '#64748b' }}>
                            <FiLoader className="spinner" size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
                            <p>Loading services...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container" style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>
                            <p>{error}</p>
                        </div>
                    ) : regions.length === 0 ? (
                        <p className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>No bacentas or services found.</p>
                    ) : (
                        regions.map(region => (
                            <div key={region} className="region-group">
                                <button
                                    className="region-header"
                                    onClick={() => toggleRegion(region)}
                                >
                                    <span className="region-name">{region}</span>
                                    <span className="region-header-right">
                                        <span className="region-count">{groupedServices[region].length} bacentas</span>
                                        {expandedRegions[region] ? (
                                            <FiChevronDown className="region-chevron" />
                                        ) : (
                                            <FiChevronRight className="region-chevron" />
                                        )}
                                    </span>
                                </button>
                                {expandedRegions[region] && groupedServices[region].map(service => (
                                    <button
                                        key={service.id}
                                        className="bacenta-service-card"
                                        onClick={() => handleServiceTap(service)}
                                    >
                                        <div className="bacenta-card-left">
                                            <div className="bacenta-icon-wrap">
                                                <FiUsers />
                                            </div>
                                            <div className="bacenta-card-info">
                                                <p className="bacenta-name">{service.bacentaName}</p>
                                                <div className="bacenta-meta">
                                                    <span className="meta-item">
                                                        <FiCalendar size={12} />
                                                        {service.date}
                                                    </span>
                                                    <span className="meta-item">
                                                        <FiUsers size={12} />
                                                        {service.attendance} people
                                                    </span>
                                                    <span className="meta-item">
                                                        <FiDollarSign size={12} />
                                                        {service.offering}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bacenta-card-right">
                                            <span className={`status-badge status-${service.status}`}>
                                                {service.status === 'submitted' ? 'Submitted' : 'Pending'}
                                            </span>
                                            <FiChevronRight className="chevron-icon" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BacentaServicesList;
