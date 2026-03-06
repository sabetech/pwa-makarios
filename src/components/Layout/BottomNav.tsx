import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiLayers, FiFlag, FiUserPlus, FiPlus } from 'react-icons/fi';
import { ActionSheet } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import './BottomNav.css';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const shouldHideFAB = location.pathname === '/dashboard/members';

    const actions: Action[] = [
        { text: 'Fill Service Form', key: 'service-form' },
        { text: 'Update Campaign Info', key: 'campaign-info' },
    ];

    const handleAction = (action: Action) => {
        setVisible(false);
        if (action.key === 'service-form') {
            navigate('/dashboard/service-selection');
        } else {
            console.log('FAB Action:', action.key);
        }
    };

    return (
        <>
            {!shouldHideFAB && (
                <button className="fab-button" onClick={() => setVisible(true)} aria-label="Add new item">
                    <FiPlus size={28} />
                </button>
            )}
            <nav className="bottom-nav">
                <NavLink to="/dashboard" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <FiHome className="icon" />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/dashboard/services" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <FiLayers className="icon" />
                    <span>Services</span>
                </NavLink>
                <NavLink to="/dashboard/campaigns" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <FiFlag className="icon" />
                    <span>Campaigns</span>
                </NavLink>
                <NavLink to="/dashboard/members" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <FiUsers className="icon" />
                    <span>Members</span>
                </NavLink>
                <NavLink to="/dashboard/arrivals" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <FiUserPlus className="icon" />
                    <span>Arrivals</span>
                </NavLink>
            </nav>
            <div className="home-indicator"></div>

            <ActionSheet
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
                onAction={handleAction}
            />
        </>
    );
};

export default BottomNav;
