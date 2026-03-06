import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { ActionSheet } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Members.css';

const Members: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const members = [
        {
            id: 1,
            name: 'John Doe',
            phone: '+233 24 123 4567',
            image: 'https://i.pravatar.cc/150?u=1'
        },
        {
            id: 2,
            name: 'Jane Smith',
            phone: '+233 20 987 6543',
            image: 'https://i.pravatar.cc/150?u=2'
        },
        {
            id: 3,
            name: 'Robert Johnson',
            phone: '+233 55 555 5555',
            image: 'https://i.pravatar.cc/150?u=3'
        },
        {
            id: 4,
            name: 'Emily Davis',
            phone: '+233 24 111 2222',
            image: 'https://i.pravatar.cc/150?u=4'
        },
        {
            id: 5,
            name: 'Michael Wilson',
            phone: '+233 27 333 4444',
            image: 'https://i.pravatar.cc/150?u=5'
        }
    ];

    const actions: Action[] = [
        { text: 'Add Member', key: 'add-member' },
        { text: 'Take Attendance', key: 'attendance' },
    ];

    const navigate = useNavigate();

    const handleAction = (action: Action) => {
        setVisible(false);
        if (action.key === 'add-member') {
            navigate('/dashboard/members/add');
        } else if (action.key === 'attendance') {
            navigate('/dashboard/members/attendance');
        } else {
            console.log('Action selected:', action.key);
        }
    };

    const headerRight = (
        <button
            className="header-action-btn"
            onClick={() => setVisible(true)}
            style={{
                background: 'none',
                border: 'none',
                color: 'currentColor',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <span className="material-symbols-outlined">more_vert</span>
        </button>
    );

    return (
        <div className="members-page">
            <PageHeader title="Members" rightAction={headerRight} />

            <div className="members-content">
                <div className="search-filter-bar">
                    <div className="search-input-container">
                        <FiSearch className="search-icon" />
                        <input type="text" placeholder="Search members..." className="search-input" />
                    </div>
                    <button className="filter-button" aria-label="Filter">
                        <FiFilter />
                    </button>
                </div>

                <div className="members-list">
                    {members.map((member) => (
                        <div key={member.id} className="member-card">
                            <div className="member-image-container">
                                <img src={member.image} alt={member.name} className="member-image" />
                            </div>
                            <div className="member-info">
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-phone">{member.phone}</p>
                            </div>
                            <button className="member-action-button" aria-label="More options">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ActionSheet
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
                onAction={handleAction}
            />
        </div>
    );
};

export default Members;
