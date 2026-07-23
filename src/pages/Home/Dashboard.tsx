import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDashboardData, DashboardData } from '../../api/dashboard';
import { useMembersWithSeverity } from '../../hooks/useAttendance';
import SeverityBadge from '../../components/SeverityBadge/SeverityBadge';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const getStatRoute = (label: string): string | null => {
        switch (label) {
            case 'STREAMS': return '/dashboard/admin/streams';
            case 'REGIONS': return '/dashboard/admin/regions';
            case 'BACENTA':
            case 'BACENTAS': return '/dashboard/admin/bacentas';
            case 'MEMBER':
            case 'MEMBERS': return '/dashboard/members';
            case 'LEADER':
            case 'LEADERS': return '/dashboard/admin/leaders';
            default: return null;
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const data = await fetchDashboardData();
                const formattedStats = Object.entries(data).map(([key, value]) => ({
                    label: key.toUpperCase(),
                    value: String(value)
                }));
                setStats(formattedStats);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const { data: membersWithSeverity = [] } = useMembersWithSeverity({ sort: 'severity' });
    const attentionMembers = membersWithSeverity.filter(m => m.consecutive_absences > 0).slice(0, 5);

    // Chart Data
    const data = [
        { name: 'Week 1', attendance: 2000, income: 1500 },
        { name: 'Week 2', attendance: 3000, income: 2800 },
        { name: 'Week 3', attendance: 2780, income: 3908 },
        { name: 'Week 4', attendance: 1890, income: 4800 },
    ];

    return (
        <div className="dashboard-container">
            {/* Stats Grid */}
            <div className="stats-grid">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div className="stat-card skeleton" key={i}>
                            <div className="stat-label-skeleton"></div>
                            <div className="stat-value-skeleton"></div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => {
                        const route = getStatRoute(stat.label);
                        return (
                            <div
                                className={`stat-card${route ? ' clickable' : ''}`}
                                key={index}
                                onClick={() => route && navigate(route)}
                            >
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Summary Row */}
            <div className="summary-row">
                <div className="summary-item">
                    <p className="summary-label">Avg Attend</p>
                    <span className="summary-value text-teal">238</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item">
                    <p className="summary-label">Weekly Inc</p>
                    <span className="summary-value text-gold">₵1,142</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item">
                    <p className="summary-label">Bussing</p>
                    <span className="summary-value text-white">0</span>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-card">
                <div className="chart-header">
                    <h3 className="chart-title">Weekly Tracking</h3>
                    <span className="badge">Growth View</span>
                </div>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="attendance" stroke="#00F5FF" fillOpacity={1} fill="url(#colorTeal)" strokeWidth={3} />
                            <Area type="monotone" dataKey="income" stroke="#D4AF37" fillOpacity={1} fill="url(#colorGold)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00F5FF' }}></div>
                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Attendance</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37' }}></div>
                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Income</span>
                    </div>
                </div>
            </div>

            {/* Members Needing Attention */}
            {attentionMembers.length > 0 && (
                <div className="attention-card">
                    <div className="attention-header">
                        <h3 className="attention-title">Members Needing Attention</h3>
                        <span className="badge">{attentionMembers.length}</span>
                    </div>
                    <div className="attention-list">
                        {attentionMembers.map((member) => (
                            <div
                                key={member.id}
                                className="attention-item"
                                onClick={() => navigate(`/dashboard/members/${member.id}`)}
                            >
                                <div className="attention-member-info">
                                    <span className="attention-member-name">{member.name}</span>
                                    <span className="attention-member-bacenta">
                                        {member.bacenta?.name || 'Unassigned'}
                                    </span>
                                </div>
                                {member.severity && (
                                    <SeverityBadge
                                        label={member.severity.label}
                                        color={member.severity.color}
                                        consecutiveAbsences={member.consecutive_absences}
                                        size="small"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
