import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiMap, FiLogOut, FiMoreHorizontal } from 'react-icons/fi';
import { ActionSheet } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import BottomNav from './BottomNav';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [actionSheetVisible, setActionSheetVisible] = useState(false);

    const user = React.useMemo(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        return { name: 'Admin', role: 'SUPER ADMIN' };
    }, []);

    // Check if we're on a page that should hide the header
    const hideHeaderPaths = ['/dashboard/settings', '/dashboard/services', '/dashboard/service-selection', '/dashboard/bacenta-select', '/dashboard/bacenta-services', '/dashboard/bacenta-service', '/dashboard/members', '/dashboard/members/add', '/dashboard/members/attendance', '/dashboard/insights', '/dashboard/admin', '/dashboard/admin/streams', '/dashboard/admin/regions', '/dashboard/admin/zones', '/dashboard/admin/bacentas', '/dashboard/admin/leaders', '/dashboard/campaigns', '/dashboard/campaigns/update'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname) || location.pathname.startsWith('/dashboard/members/');

    const actions: Action[] = [
        { text: 'Insights', key: 'insights' },
        { text: 'Admin Portal', key: 'admin' },
        { text: 'Settings', key: 'settings' },
        { text: 'Logout', key: 'logout', danger: true },
    ];

    const handleAction = (action: Action) => {
        setActionSheetVisible(false);
        if (action.key === 'logout') {
            // Clear session and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        } else if (action.key === 'admin') {
            navigate('/dashboard/admin');
        } else if (action.key === 'settings') {
            navigate('/dashboard/settings');
        } else if (action.key === 'insights') {
            navigate('/dashboard/insights');
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="logo-text">MAKARIOS ADMIN</span>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FiHome /> Dashboard
                    </NavLink>
                    <NavLink to="/dashboard/members" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FiUsers /> Members
                    </NavLink>
                    <NavLink to="/dashboard/churches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FiMap /> Churches
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item logout-button" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            <main className="main-area">
                {!shouldHideHeader && (
                    <header className="main-header">
                        <div className="header-left">
                            <div className="profile-img-container">
                                <img src={user.img_url} alt="Profile" className="profile-img" />
                            </div>
                            <div>
                                <h1 className="header-greeting">Hi, {user.name ? user.name.split(' ')[0] : 'Admin'}</h1>
                                <p className="header-subtitle">{user.role}</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="menu-button" onClick={() => setActionSheetVisible(true)} aria-label="Menu">
                                <FiMoreHorizontal size={24} />
                            </button>
                        </div>
                    </header>
                )}
                <div className={`main-content ${shouldHideHeader ? 'no-header' : ''} ${location.pathname.startsWith('/dashboard/admin') ? 'admin-portal' : ''}`}>
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-nav-container">
                <BottomNav />
            </div>

            <ActionSheet
                visible={actionSheetVisible}
                actions={actions}
                onClose={() => setActionSheetVisible(false)}
                onAction={handleAction}
            />
        </div>
    );
};

export default MainLayout;
