import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaders, Leader, deleteLeader, updateLeader } from '../../api/leaders';
import { fetchRoles, Role } from '../../api/roles';
import './ManageLeaders.css';
import './AdminShared.css';

const ManageLeaders: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [leaderToDelete, setLeaderToDelete] = useState<Leader | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [leaderToEdit, setLeaderToEdit] = useState<Leader | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [leadersData, rolesData] = await Promise.all([fetchLeaders(), fetchRoles()]);
                setLeaders(leadersData);
                setRoles(rolesData);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load leaders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const loadLeaders = async () => {
        try {
            const data = await fetchLeaders();
            setLeaders(data);
        } catch (err) {
            console.error('Error fetching leaders:', err);
        }
    };


    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const confirmDelete = (leader: Leader) => {
        setLeaderToDelete(leader);
        setDeleteModalVisible(true);
    };

    const handleEditClick = (leader: Leader) => {
        setLeaderToEdit(leader);
        const matchedRole = roles.find(r => r.name === leader.role);
        setSelectedRoleId(matchedRole ? matchedRole.id : '');
        setEditModalVisible(true);
    };

    const handleUpdateRole = async () => {
        if (!leaderToEdit || selectedRoleId === '') return;
        try {
            setIsUpdating(true);
            await updateLeader(leaderToEdit.id, { role: roles.find(r => r.id === selectedRoleId)?.name });
            await loadLeaders();
            showToast(`Role updated successfully for ${leaderToEdit.name}.`, 'success');
            setEditModalVisible(false);
            setLeaderToEdit(null);
        } catch (err) {
            console.error('Error updating leader role:', err);
            showToast('Failed to update role. Please try again.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const performDelete = async () => {
        if (!leaderToDelete) return;
        try {
            setIsDeleting(true);
            await deleteLeader(leaderToDelete.id);
            setLeaders(leaders.filter(l => l.id !== leaderToDelete.id));
            showToast('Leader removed successfully.', 'success');
            setDeleteModalVisible(false);
            setLeaderToDelete(null);
        } catch (err) {
            console.error('Error deleting leader:', err);
            showToast('Failed to delete leader. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this leader?')) {
            try {
                await deleteLeader(id);
                setLeaders(leaders.filter(l => l.id !== id));
            } catch (err) {
                console.error('Error deleting leader:', err);
                alert('Failed to delete leader.');
            }
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getAssignmentIcon = (type: string) => {
        switch (type) {
            case 'Stream': return 'waves';
            case 'Region': return 'map';
            case 'Bacenta': return 'hub';
            default: return 'person_pin_circle';
        }
    };

    const filteredLeaders = leaders.filter(leader =>
        leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader?.leading?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="manage-leaders-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading leaders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-leaders-container">
            <header className="admin-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/dashboard/admin')}>
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

            <div className="leaders-content-wrapper">
                <header className="leaders-header">
                    <h2 className="leaders-title">Manage Leaders</h2>
                    <p className="leaders-subtitle">
                        Track leadership development, oversee ministerial assignments, and manage the ecclesiastical hierarchy of the Makarios community.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <section className="leader-stats">
                    <div className="stat-card-leaders">
                        <span className="material-symbols-outlined card-icon">stars</span>
                        <span className="stat-label">Total Active Leaders</span>
                        <span className="stat-value">{String(leaders.length).padStart(2, '0')}</span>
                    </div>
                    <div className="search-section">
                        <div className="admin-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search leaders, roles, or assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="leader-list-header">
                    <div>Leader Profile</div>
                    <div>Assignment</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                <div className="leader-list">
                    {filteredLeaders.map((leader) => (
                        <div key={leader.id} className="leader-card">
                            <div className="leader-accent"></div>
                            <div className="leader-identity">
                                <div className="leader-img-wrapper">
                                    {leader.img_url ? (
                                        <img src={leader.img_url} alt={leader.name} className="leader-img" />
                                    ) : (
                                        <div className="leader-initials-large">
                                            {getInitials(leader.name)}
                                        </div>
                                    )}
                                </div>
                                <div className="leader-details">
                                    <h3>{leader.name}</h3>
                                    <div className="leader-roles">
                                        <span className="role-chip">{leader.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="leader-assignment">
                                <span className="assignment-label">Currently Leading</span>
                                <div className="assignment-value">
                                    <span className="material-symbols-outlined assignment-icon">
                                        {getAssignmentIcon(leader.leading?.type || '')}
                                    </span>
                                    <div>
                                        <span>{leader.leading?.name}</span>
                                        <div className="assignment-type">{leader.leading?.type}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="leader-actions">
                                <button className="action-btn" onClick={() => handleEditClick(leader)}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="action-btn delete" onClick={() => confirmDelete(leader)}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Role Modal */}
            {editModalVisible && leaderToEdit && (
                <div className="modal-overlay" onClick={() => setEditModalVisible(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Leader Role</h3>
                            <button className="modal-close" onClick={() => setEditModalVisible(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="edit-leader-profile">
                                <div className="leader-img-wrapper" style={{ width: '3.5rem', height: '3.5rem', flexShrink: 0 }}>
                                    {leaderToEdit.img_url ? (
                                        <img src={leaderToEdit.img_url} alt={leaderToEdit.name} className="leader-img" />
                                    ) : (
                                        <div className="leader-initials-large">{getInitials(leaderToEdit.name)}</div>
                                    )}
                                </div>
                                <div>
                                    <p className="edit-leader-name">{leaderToEdit.name}</p>
                                    <span className="role-chip">{leaderToEdit.role}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="leader-role">New Role</label>
                                <select
                                    id="leader-role"
                                    value={selectedRoleId}
                                    onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : '')}
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setEditModalVisible(false)} disabled={isUpdating}>Cancel</button>
                            <button
                                className="btn-submit"
                                onClick={handleUpdateRole}
                                disabled={selectedRoleId === '' || isUpdating}
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalVisible && leaderToDelete && (
                <div className="modal-overlay" onClick={() => setDeleteModalVisible(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="modal-close" onClick={() => setDeleteModalVisible(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            <span className="material-symbols-outlined delete-warning-icon" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '1rem' }}>warning</span>
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Are you sure you want to remove <strong>{leaderToDelete.name}</strong> from the leaders list?</p>
                            <p className="delete-subtext" style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModalVisible(false)} disabled={isDeleting}>Cancel</button>
                            <button className="btn-submit" style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)' }} onClick={performDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Leader'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`toast-notification ${toast.type}`}>
                    <span className="material-symbols-outlined">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <p>{toast.message}</p>
                </div>
            )}

        </div>
    );
};

export default ManageLeaders;
