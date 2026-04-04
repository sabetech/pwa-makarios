import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiDollarSign, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import './BacentaServicesList.css';

interface BacentaService {
    id: number;
    bacentaName: string;
    region: string;
    date: string;
    weekStart: string;
    attendance: number;
    offering: string;
    status: 'submitted' | 'pending';
}

const mockBacentaServices: BacentaService[] = [
    {
        id: 1,
        bacentaName: 'Grace Bacenta',
        region: 'Ashanti',
        date: 'Feb 15, 2026',
        weekStart: 'Feb 16, 2026',
        attendance: 24,
        offering: 'GHc 320.00',
        status: 'submitted'
    },
    {
        id: 2,
        bacentaName: 'Faith Bacenta',
        region: 'Ashanti',
        date: 'Feb 15, 2026',
        weekStart: 'Feb 16, 2026',
        attendance: 18,
        offering: 'GHc 210.50',
        status: 'submitted'
    },
    {
        id: 3,
        bacentaName: 'Hope Bacenta',
        region: 'Greater Accra',
        date: 'Feb 15, 2026',
        weekStart: 'Feb 16, 2026',
        attendance: 31,
        offering: 'GHc 450.00',
        status: 'submitted'
    },
    {
        id: 4,
        bacentaName: 'Love Bacenta',
        region: 'Eastern',
        date: 'Feb 8, 2026',
        weekStart: 'Feb 9, 2026',
        attendance: 22,
        offering: 'GHc 280.00',
        status: 'submitted'
    },
    {
        id: 5,
        bacentaName: 'Joy Bacenta',
        region: 'Greater Accra',
        date: 'Feb 8, 2026',
        weekStart: 'Feb 9, 2026',
        attendance: 15,
        offering: 'GHc 175.00',
        status: 'pending'
    }
];

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

        const weekStartStr = weekStart.format('MMM D, YYYY');
        options.push({ value: weekStartStr, label });
    }

    return options;
};

const weekOptions = generateWeekOptions();

const BacentaServicesList: React.FC = () => {
    const navigate = useNavigate();
    const [selectedWeek, setSelectedWeek] = useState<string>(weekOptions[0].value);

    const filteredServices = useMemo(() => {
        return mockBacentaServices.filter(service => service.weekStart === selectedWeek);
    }, [selectedWeek]);

    const groupedServices = filteredServices.reduce((acc, service) => {
        const region = service.region;
        if (!acc[region]) {
            acc[region] = [];
        }
        acc[region].push(service);
        return acc;
    }, {} as Record<string, BacentaService[]>);

    const regions = Object.keys(groupedServices).sort();

    const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        regions.forEach(region => {
            initial[region] = true;
        });
        return initial;
    });

    const toggleRegion = (region: string) => {
        setExpandedRegions(prev => ({
            ...prev,
            [region]: !prev[region]
        }));
    };

    const handleServiceTap = (serviceId: number) => {
        console.log('Tapped service:', serviceId);
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
                        <span className="stat-value">{filteredServices.length}</span>
                        <span className="stat-label">Total Services</span>
                    </div>
                    <div className="bacenta-stat-card">
                        <span className="stat-value">
                            {filteredServices.reduce((sum, s) => sum + s.attendance, 0)}
                        </span>
                        <span className="stat-label">Total Attendance</span>
                    </div>
                </div>

                {/* Services List */}
                <div className="bacenta-services-list">
                    {regions.map(region => (
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
                                    onClick={() => handleServiceTap(service.id)}
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BacentaServicesList;
