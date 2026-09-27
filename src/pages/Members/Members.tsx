import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { ActionSheet, Dialog, Toast } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { useMembers } from '../../hooks/useMembers';
import { useDeleteMember } from '../../hooks/useDeleteMember';
import type { Member } from '../../api/members';
import { useMembersWithSeverity } from '../../hooks/useAttendance';
import SeverityBadge from '../../components/SeverityBadge/SeverityBadge';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Members.css';

const Members: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const { data: members = [], isLoading, isError } = useMembers();
    const deleteMutation = useDeleteMember();
    const { data: membersWithSeverity = [] } = useMembersWithSeverity();
    const severityMap = new Map(membersWithSeverity.map(m => [m.id, m]));
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

    const confirmDeleteMember = (member: Member) => {
        Dialog.confirm({
            title: `Delete ${member.name}?`,
            content: 'This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync(member.id);
                    Toast.show({
                        icon: 'success',
                        content: 'Member deleted',
                        position: 'bottom',
                    });
                } catch {
                    Toast.show({
                        icon: 'fail',
                        content: 'Failed to delete member',
                    });
                }
            },
        });
    };

    const handleMemberAction = (action: Action) => {
        const member = selectedMember;
        if (!member) return;
        if (action.key === 'delete') {
            setSelectedMember(null);
            confirmDeleteMember(member);
            return;
        }
        setSelectedMember(null);
        if (action.key === 'view-profile') {
            navigate(`/dashboard/members/${member.id}`);
        } else if (action.key === 'call' && member.phone) {
            window.location.href = `tel:${member.phone}`;
        } else if (action.key === 'whatsapp') {
            const raw = member.whatsapp || member.phone || '';
            const digits = raw.replace(/\D/g, '');
            if (digits) {
                window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer');
            }
        } else if (action.key === 'transfer') {
            navigate(`/dashboard/members/edit/${member.id}`);
        }
    };

    const memberActions: Action[] = selectedMember
        ? [
            { text: 'View Profile', key: 'view-profile' },
            ...(selectedMember.phone
                ? [{ text: `Call ${selectedMember.phone}`, key: 'call' } as Action]
                : []),
            ...((selectedMember.whatsapp || selectedMember.phone)
                ? [{ text: 'WhatsApp', key: 'whatsapp' } as Action]
                : []),
            { text: 'Transfer Member', key: 'transfer', description: 'Change bacenta / basonta' },
            { text: 'Delete Member', key: 'delete', danger: true, description: 'This cannot be undone' },
        ]
        : [];

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.phone && member.phone.includes(searchTerm));
        
        if (severityFilter === 'all') return matchesSearch;
        
        const memberSeverity = severityMap.get(member.id);
        if (!memberSeverity || !memberSeverity.severity) return false;
        
        const label = memberSeverity.severity.label.toLowerCase();
        return matchesSearch && label === severityFilter;
    });

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
                    <button
                        className={`filter-button ${severityFilter !== 'all' ? 'active' : ''}`}
                        onClick={() => {
                            const filters = ['all', 'severe', 'moderate', 'mild'];
                            const currentIndex = filters.indexOf(severityFilter);
                            setSeverityFilter(filters[(currentIndex + 1) % filters.length]);
                        }}
                    >
                        <FiFilter />
                    </button>
                </div>
                {severityFilter !== 'all' && (
                    <div className="active-filter">
                        <span>Filtered by: <strong>{severityFilter}</strong></span>
                        <button className="clear-filter" onClick={() => setSeverityFilter('all')}>×</button>
                    </div>
                )}
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
                                        const memberSeverity = severityMap.get(member.id);
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
                                                        {memberSeverity && memberSeverity.severity && memberSeverity.consecutive_absences > 0 && (
                                                            <div className="member-severity">
                                                                <SeverityBadge
                                                                    label={memberSeverity.severity.label}
                                                                    color={memberSeverity.severity.color}
                                                                    consecutiveAbsences={memberSeverity.consecutive_absences}
                                                                    memberId={member.id}
                                                                    size="small"
                                                                    showCount
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button className="member-action-button" aria-label={`More options for ${member.name}`} aria-haspopup="menu" onClick={(e) => { e.stopPropagation(); setSelectedMember(member); }}>
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

            <ActionSheet
                visible={!!selectedMember}
                extra={selectedMember?.name}
                actions={memberActions}
                onClose={() => setSelectedMember(null)}
                onAction={handleMemberAction}
            />
        </div>
    );
};

export default Members;
