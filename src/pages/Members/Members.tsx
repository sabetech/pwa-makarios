import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { ActionSheet } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { useMembers } from '../../hooks/useMembers';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Members.css';

const Members: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: members = [], isLoading, isError } = useMembers();
    const listRef = useRef<HTMLDivElement>(null);
    const [listDimensions, setListDimensions] = useState({ width: 0, height: 0 });

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

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm))
    );

    const isLoaded = !isLoading && !isError && filteredMembers.length > 0;

    useLayoutEffect(() => {
        if (!isLoaded) return;

        const container = listRef.current;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth - 32;
        const height = container.clientHeight || window.innerHeight - 250;

        setListDimensions({ width, height });

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setListDimensions({ width, height });
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [isLoaded]);

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
            <div className="sticky-header-container">
                <PageHeader title="Members" rightAction={headerRight} />
                <div className="search-filter-bar">
                    <div className="search-input-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-button" aria-label="Filter">
                        <FiFilter />
                    </button>
                </div>
            </div>

            <div className="members-content">
                {isLoading && (
                    <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading members...</p>
                    </div>
                )}

                {isError && (
                    <div className="error-container" style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                        <p>Failed to load members. Please try again.</p>
                    </div>
                )}

                {!isLoading && !isError && (
                    filteredMembers.length === 0 ? (
                        <div className="no-results" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            <p>No members found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="members-list" ref={listRef}>
                            {listDimensions.width > 0 && listDimensions.height > 0 ? (
                                <List
                                    width={listDimensions.width}
                                    height={listDimensions.height}
                                    rowCount={filteredMembers.length}
                                    rowHeight={90}
                                    rowRenderer={({ index, key, style }) => {
                                        const member = filteredMembers[index];
                                        return (
                                            <div key={key} style={style}>
                                                <div className="member-card" onClick={() => navigate(`/dashboard/members/${member.id}`)}>
                                                    <div className="member-image-container">
                                                        <img
                                                            src={member.img_url || 'https://via.placeholder.com/150?text=No+Image'}
                                                            alt={member.name}
                                                            className="member-image"
                                                        />
                                                    </div>
                                                    <div className="member-info">
                                                        <h3 className="member-name">{member.name}</h3>
                                                        <p className="member-phone">{member.phone || 'No phone'}</p>
                                                    </div>
                                                    <button className="member-action-button" aria-label="More options" onClick={(e) => { e.stopPropagation(); console.log('options clicked'); }}>
                                                        <span className="material-symbols-outlined">more_vert</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            ) : (
                                <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
                                    <p>Preparing list...</p>
                                </div>
                            )}
                        </div>
                    )
                )}
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
