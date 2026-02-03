import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon, FiHome, FiUsers, FiMap, FiLogOut, FiMoreHorizontal } from 'react-icons/fi';
import { ActionSheet } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import BottomNav from './BottomNav';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [actionSheetVisible, setActionSheetVisible] = useState(false);

    const actions: Action[] = [
        { text: 'Admin Portal', key: 'admin' },
        { text: 'Settings', key: 'settings' },
        { text: 'Logout', key: 'logout', danger: true },
    ];

    const handleAction = (action: Action) => {
        setActionSheetVisible(false);
        if (action.key === 'logout') {
            // Clear token and redirect
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        } else if (action.key === 'admin') {
            console.log('Navigate to Admin Portal');
        } else if (action.key === 'settings') {
            navigate('/dashboard/settings');
        }
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
                    <NavLink to="/login" className="nav-item">
                        <FiLogOut /> Logout
                    </NavLink>
                </div>
            </aside>

            <main className="main-area">
                <header className="main-header">
                    <div className="header-left">
                        <div className="profile-img-container">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbULG3nrHtJyy-h0O17JBNpxnUdZiOsUIsLHZdnBOmNuE8E5VDav27O5Zz2aOVIutvdTol7CbWUu3nJRKuBxwjVfAOsmVajT_FdQpFg9883ZeVdJ3uBqUUnLYYMa9sN7qXbvDvmb-FVMcnMq1i3ddTHrTIE_FULqUe32-aHWYFrwJqok1BmGr3TiYBiA4E4Qe4h7tB_YAO2kxrZF4-EToscePQz8juFJ44UCfkvKa_tBj7bV2ZBY6zBni2v5VWeKOz3bcEtDujTOf" alt="Profile" className="profile-img" />
                        </div>
                        <div>
                            <h1 className="header-greeting">Hi, Admin</h1>
                            <p className="header-subtitle">SUPER ADMIN</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>
                        <button className="menu-button" onClick={() => setActionSheetVisible(true)} aria-label="Menu">
                            <FiMoreHorizontal size={24} />
                        </button>
                    </div>
                </header>
                <div className="main-content">
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
