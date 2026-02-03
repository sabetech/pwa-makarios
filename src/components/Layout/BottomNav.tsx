import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiLayers, FiFlag, FiUserPlus, FiPlus } from 'react-icons/fi';
import './BottomNav.css';

const BottomNav: React.FC = () => {
    return (
        <>
            <button className="fab-button">
                <FiPlus size={28} />
            </button>
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
        </>
    );
};

export default BottomNav;
