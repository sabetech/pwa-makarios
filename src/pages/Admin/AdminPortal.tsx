import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPortal.css';

interface ManagementItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'primary' | 'secondary' | 'tertiary';
    actionLabel: string;
}

const managementItems: ManagementItem[] = [
    {
        id: 'churches',
        title: 'Manage Churches',
        description: 'Oversee global church locations, establish new sanctuaries, and manage institutional records.',
        icon: 'church',
        type: 'primary',
        actionLabel: 'Explore Directory'
    },
    {
        id: 'streams',
        title: 'Manage Streams',
        description: 'Configure ministry streams, align departmental flows, and track specialized community movements.',
        icon: 'waves',
        type: 'tertiary',
        actionLabel: 'Manage Flows'
    },
    {
        id: 'regions',
        title: 'Manage Regions',
        description: 'Define geographic territories, manage regional councils, and optimize territorial expansion.',
        icon: 'map',
        type: 'secondary',
        actionLabel: 'View Map'
    },
    {
        id: 'zones',
        title: 'Manage Zones',
        description: 'Zones are the areas a collection of bacentas belong to.',
        icon: 'share_location',
        type: 'tertiary',
        actionLabel: 'Zone Setup'
    },
    {
        id: 'bacentas',
        title: 'Manage Bacentas',
        description: 'The heartbeat of the church. Manage cell groups, home gatherings, and grassroots spiritual nodes.',
        icon: 'hub',
        type: 'primary',
        actionLabel: 'Cell Management'
    },
    {
        id: 'leaders',
        title: 'Manage Leaders',
        description: 'Track leadership development, assign ministerial roles, and manage the ordained hierarchy.',
        icon: 'stars',
        type: 'secondary',
        actionLabel: 'Leadership Profile'
    },
    {
        id: 'members',
        title: 'Manage Members',
        description: 'Comprehensive database of the congregation. Manage attendance, spiritual growth, and demographics.',
        icon: 'groups',
        type: 'tertiary',
        actionLabel: 'Member Database'
    },
    {
        id: 'campaigns',
        title: 'Manage Campaigns',
        description: 'Configure and oversee church campaigns, initiatives, and outreach programs.',
        icon: 'campaign',
        type: 'primary',
        actionLabel: 'Campaign Setup'
    }
];

const AdminPortal: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-portal-container">
            <header className="admin-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="admin-profile-img">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbULG3nrHtJyy-h0O17JBNpxnUdZiOsUIsLHZdnBOmNuE8E5VDav27O5Zz2aOVIutvdTol7CbWUu3nJRKuBxwjVfAOsmVajT_FdQpFg9883ZeVdJ3uBqUUnLYYMa9sN7qXbvDvmb-FVMcnMq1i3ddTHrTIE_FULqUe32-aHWYFrwJqok1BmGr3TiYBiA4E4Qe4h7tB_YAO2kxrZF4-EToscePQz8juFJ44UCfkvKa_tBj7bV2ZBY6zBni2v5VWeKOz3bcEtDujTOf"
                            alt="Admin"
                        />
                    </div>
                    <h1 className="admin-logo">MAKARIOS</h1>
                </div>
                <div className="header-right">
                    <button className="icon-btn" onClick={() => navigate('/dashboard/settings')}>
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <div className="admin-content-wrapper">
                <section className="admin-hero">
                    <p className="hero-label">Management Console</p>
                    <h2 className="hero-title">
                        Welcome <span className="highlight">Admin</span>
                    </h2>
                    <div className="hero-divider"></div>
                    <p className="hero-description">
                        Centralized oversight for the Makarios church. Navigate through the church structures, manage leadership hierarchies, and monitor the spiritual growth of the community.
                    </p>
                </section>

                <div className="editorial-grid">
                    {managementItems.map((item) => (
                        <div
                            key={item.id}
                            className={`management-card card-${item.type}`}
                            onClick={() => {
                            if (item.id === 'streams') {
                                navigate('/dashboard/admin/streams');
                            } else if (item.id === 'regions') {
                                navigate('/dashboard/admin/regions');
                            } else if (item.id === 'zones') {
                                navigate('/dashboard/admin/zones');
                            } else if (item.id === 'bacentas') {
                                navigate('/dashboard/admin/bacentas');
                            } else if (item.id === 'leaders') {
                                navigate('/dashboard/admin/leaders');
                            } else if (item.id === 'campaigns') {
                                navigate('/dashboard/admin/campaigns');
                            } else {
                                console.log(`Navigating to ${item.id}`);
                            }
                            }}
                        >
                            <span className="material-symbols-outlined card-bg-icon">
                                {item.icon}
                            </span>
                            <div className="card-content">
                                <div className="icon-wrapper">
                                    <span className="material-symbols-outlined">
                                        {item.icon}
                                    </span>
                                </div>
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-description">{item.description}</p>
                                <div className="card-footer">
                                    {item.actionLabel}
                                    <span className="material-symbols-outlined arrow-icon">
                                        arrow_forward
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
