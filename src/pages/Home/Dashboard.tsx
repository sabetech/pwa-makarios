import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    // Data from HTML
    const stats = [
        { label: 'Churches', value: '1' },
        { label: 'Streams', value: '3' },
        { label: 'Regions', value: '13' },
        { label: 'Zones', value: '55' },
        { label: 'Bacentas', value: '82' },
        { label: 'Members', value: '460' },
        { label: 'Micro', value: '3' },
        { label: 'Leaders', value: '84' },
        { label: 'Guests', value: '22' },
    ];

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
                {stats.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}
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
        </div>
    );
};

export default Dashboard;
