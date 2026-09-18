import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Dialog, Popup, Toast, SpinLoading, ErrorBlock } from 'antd-mobile';
import {
    Bar, XAxis, YAxis, Tooltip as ReTooltip, ComposedChart, Line, ResponsiveContainer, Legend,
} from 'recharts';
import {
    fetchBacenta,
    fetchBacentaMembers,
    suspendBacenta,
    activateBacenta,
} from '../../api/bacentas';
import './BacentaDetails.css';

const BacentaDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showMembers, setShowMembers] = useState(false);

    const bacentaId = Number(id);

    const { data: bacenta, isLoading, error } = useQuery(
        ['bacenta', bacentaId],
        () => fetchBacenta(bacentaId),
        { enabled: !Number.isNaN(bacentaId) }
    );

    const { data: members, isLoading: membersLoading } = useQuery(
        ['bacenta-members', bacentaId],
        () => fetchBacentaMembers(bacentaId),
        { enabled: !Number.isNaN(bacentaId) && showMembers }
    );

    const stateMutation = useMutation(
        (action: 'suspend' | 'activate') =>
            action === 'suspend' ? suspendBacenta(bacentaId) : activateBacenta(bacentaId),
        {
            onSuccess: (_data, action) => {
                Toast.show({ content: action === 'suspend' ? 'Bacenta suspended' : 'Bacenta activated' });
                queryClient.invalidateQueries(['bacenta', bacentaId]);
                queryClient.invalidateQueries('bacentas');
            },
            onError: () => {
                Toast.show({ icon: 'fail', content: 'Action failed' });
            },
        }
    );

    if (isLoading) {
        return <div className="bacenta-details-loading"><SpinLoading color="primary" /></div>;
    }

    if (error || !bacenta) {
        return (
            <div className="bacenta-details-page">
                <ErrorBlock
                    status="default"
                    title="Bacenta not found"
                    description="You may not have access to this bacenta."
                    />
                <button className="bd-back-link" onClick={() => navigate(-1)}>Go back</button>
            </div>
        );
    }

    const confirmSuspend = () => {
        Dialog.confirm({
            title: 'Suspend bacenta?',
            content: `${bacenta.name} will be marked inactive. This can be reversed later.`,
            confirmText: 'Suspend',
            cancelText: 'Cancel',
            onConfirm: () => stateMutation.mutate('suspend'),
        });
    };

    const chartData = [...(bacenta.recent_services ?? [])]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((s) => ({
            name: new Date(s.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            Attendance: s.attendance,
            Offering: s.offering,
        }));

    const mapCoords = bacenta.location?.lat_lng
        ? bacenta.location.lat_lng.split(',').map((v) => parseFloat(v.trim()))
        : null;
    const hasMap = mapCoords && mapCoords.length === 2 && mapCoords.every((n) => !Number.isNaN(n));

    return (
        <div className="bacenta-details-page">
            <header className="bd-header">
                <button className="bd-back" aria-label="Back" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="bd-title">Bacenta Details</h2>
            </header>

            <section className={`bd-hero ${bacenta.is_active ? '' : 'bd-hero--suspended'}`}>
                <div className="bd-hero-top">
                    <div className="bd-hero-icon">
                        <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div className="bd-hero-info">
                        <h1>{bacenta.name}</h1>
                        <p>{bacenta.region?.name || 'No region'}{bacenta.zone ? ` • ${bacenta.zone.name}` : ''}</p>
                    </div>
                    <span className={`bd-status-chip ${bacenta.is_active ? 'active' : 'suspended'}`}>
                        {bacenta.is_active ? 'Active' : 'Suspended'}
                    </span>
                </div>
                {bacenta.leader && (
                    <div className="bd-leader-row">
                        {bacenta.leader.img_url ? (
                            <img src={bacenta.leader.img_url} alt={bacenta.leader.name} className="bd-leader-avatar" />
                        ) : (
                            <span className="material-symbols-outlined">person</span>
                        )}
                        <span>Leader: <strong>{bacenta.leader.name}</strong></span>
                    </div>
                )}
            </section>

            <section className="bd-card bd-members-card">
                <div className="bd-members-stat">
                    <span className="material-symbols-outlined">groups</span>
                    <div>
                        <p className="bd-stat-value">{bacenta.members_count}</p>
                        <p className="bd-stat-label">Members</p>
                    </div>
                </div>
                <button className="bd-view-members-btn" onClick={() => setShowMembers(true)}>
                    View list
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </section>

            <section className="bd-card">
                <h3 className="bd-section-title">Recent services</h3>
                {chartData.length === 0 ? (
                    <ErrorBlock status="empty" title="No services yet" description="Recorded services will appear here." />
                ) : (
                    <div className="bd-chart-wrap">
                        <ResponsiveContainer width="100%" height={220}>
                            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#999" />
                                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#999" allowDecimals={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#999" />
                                <ReTooltip />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar yAxisId="left" dataKey="Attendance" fill="#580B1E" radius={[4, 4, 0, 0]} barSize={26} />
                                <Line yAxisId="right" type="monotone" dataKey="Offering" stroke="#D4AF37" strokeWidth={2} dot={{ r: 3 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            {hasMap && (
                <section className="bd-card">
                    <h3 className="bd-section-title">Meeting location</h3>
                    <iframe
                        title="Bacenta venue map"
                        className="bd-map"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords![1] + 0.004},${mapCoords![0] + 0.002},${mapCoords![1] - 0.004},${mapCoords![0] - 0.002}&layer=mapnik&marker=${mapCoords![0]},${mapCoords![1]}`}
                        loading="lazy"
                    />
                    {bacenta.location?.address && <p className="bd-address">{bacenta.location.address}</p>}
                </section>
            )}

            {!bacenta.is_active ? (
                <button
                    className="bd-action-btn bd-activate"
                    disabled={stateMutation.isLoading}
                    onClick={() => stateMutation.mutate('activate')}
                >
                    Reactivate bacenta
                </button>
            ) : (
                <button
                    className="bd-action-btn bd-suspend"
                    disabled={stateMutation.isLoading}
                    onClick={confirmSuspend}
                >
                    <span className="material-symbols-outlined">block</span>
                    Suspend bacenta
                </button>
            )}

            <Popup
                visible={showMembers}
                onMaskClick={() => setShowMembers(false)}
                bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70vh', overflowY: 'auto' }}
            >
                <div className="bd-members-popup">
                    <div className="bd-popup-header">
                        <h3>Members ({members?.length ?? bacenta.members_count})</h3>
                        <button className="bd-popup-close" aria-label="Close" onClick={() => setShowMembers(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {membersLoading ? (
                        <div className="bd-members-loading"><SpinLoading /></div>
                    ) : (
                        <ul className="bd-members-list">
                            {(members ?? []).map((m) => (
                                <li key={m.id} className="bd-member-row">
                                    {m.img_url ? (
                                        <img src={m.img_url} alt={m.name} className="bd-member-avatar" />
                                    ) : (
                                        <span className="bd-member-avatar bd-member-initial">{m.name.charAt(0)}</span>
                                    )}
                                    <div>
                                        <p className="bd-member-name">{m.name}</p>
                                        {m.phone && <p className="bd-member-phone">{m.phone}</p>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Popup>
        </div>
    );
};

export default BacentaDetails;
