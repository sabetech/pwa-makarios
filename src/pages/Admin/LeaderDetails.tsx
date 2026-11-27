import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Dialog, Popup, Toast, SpinLoading, ErrorBlock } from 'antd-mobile';
import {
    fetchLeaderProfile,
    updateLeaderProfile,
    uploadLeaderPicture,
    fetchAssignableEntities,
    assignLeader,
    unassignLeader,
    LeaderEntity,
    LeaderEntityType,
    LeaderProfile,
} from '../../api/leaders';
import { fetchRoles } from '../../api/roles';
import { startImpersonation } from '../../api/auth';
import { getStoredUser, isAdmin, startGhost } from '../../utils/authStorage';
import './BacentaDetails.css';
import './LeaderDetails.css';

const TYPE_LABEL: Record<LeaderEntityType, string> = {
    stream: 'Stream',
    region: 'Region',
    zone: 'Zone',
    bacenta: 'Bacenta',
};

const TYPE_ICON: Record<LeaderEntityType, string> = {
    stream: 'waves',
    region: 'map',
    zone: 'person_pin_circle',
    bacenta: 'hub',
};

/** Region and zone leads can only lead one at a time (backend enforces it). */
const SINGLE_ENTITY_TYPES: LeaderEntityType[] = ['region', 'zone'];

const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const errorMessage = (err: any, fallback: string) => err?.response?.data?.message || fallback;

/** Assigning or moving: `from` is the entity being moved away from, if any. */
interface AssignTarget {
    type: LeaderEntityType;
    from?: LeaderEntity;
}

const LeaderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const leaderId = Number(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [showRolePicker, setShowRolePicker] = useState(false);
    const [assignTarget, setAssignTarget] = useState<AssignTarget | null>(null);
    const [entitySearch, setEntitySearch] = useState('');

    const { data: leader, isLoading, error } = useQuery(
        ['leader', leaderId],
        () => fetchLeaderProfile(leaderId),
        { enabled: !Number.isNaN(leaderId) }
    );

    const { data: roles = [] } = useQuery('roles', fetchRoles, { enabled: showRolePicker });

    const { data: assignable = [], isLoading: assignableLoading } = useQuery(
        ['leader-assignable', assignTarget?.type],
        () => fetchAssignableEntities(assignTarget!.type),
        { enabled: !!assignTarget }
    );

    const canGhost = getStoredUser()?.role === 'Super Admin';
    // Region Leads can view leaders in their region but not change anything.
    const [canEdit] = useState(isAdmin);

    const ghostMutation = useMutation(() => startImpersonation(leaderId), {
        onSuccess: (res) => {
            startGhost(res.data.token, res.data.user);
            // Full reload: react-query keys and layout state aren't scoped per user.
            window.location.assign('/dashboard');
        },
        onError: (err) => {
            Toast.show({ icon: 'fail', content: errorMessage(err, 'Could not ghost into this account') });
        },
    });

    const confirmGhost = (name: string) => {
        Dialog.confirm({
            title: `Ghost in as ${name}?`,
            content: 'You will see and act as this user until you exit ghost mode. Anything you do is done as them, and the session is logged.',
            confirmText: 'Ghost in',
            onConfirm: () => ghostMutation.mutate(),
        });
    };

    const applyProfile = (profile: LeaderProfile) => {
        queryClient.setQueryData(['leader', leaderId], profile);
        queryClient.invalidateQueries('leaders');
        queryClient.invalidateQueries('leader-assignable');
    };

    const onFail = (fallback: string) => (err: any) => {
        Toast.show({ icon: 'fail', content: errorMessage(err, fallback) });
    };

    const nameMutation = useMutation((name: string) => updateLeaderProfile(leaderId, { name }), {
        onSuccess: (profile) => {
            applyProfile(profile);
            setEditingName(false);
            Toast.show({ content: 'Name updated' });
        },
        onError: onFail('Failed to update name'),
    });

    const roleMutation = useMutation((role: string | null) => updateLeaderProfile(leaderId, { role }), {
        onSuccess: (profile) => {
            applyProfile(profile);
            setShowRolePicker(false);
            Toast.show({ content: profile.role ? `Role changed to ${profile.role}` : 'Role removed' });
        },
        onError: onFail('Failed to update role'),
    });

    const pictureMutation = useMutation((file: File) => uploadLeaderPicture(leaderId, file), {
        onSuccess: (profile) => {
            applyProfile(profile);
            Toast.show({ content: 'Picture updated' });
        },
        onError: onFail('Failed to upload picture'),
    });

    const assignMutation = useMutation(
        (vars: { type: LeaderEntityType; entity_id: number; from_id?: number }) => assignLeader(leaderId, vars),
        {
            onSuccess: (profile, vars) => {
                applyProfile(profile);
                setAssignTarget(null);
                Toast.show({ content: vars.from_id ? 'Leader moved' : 'Leader assigned' });
            },
            onError: onFail('Failed to assign leader'),
        }
    );

    const unassignMutation = useMutation(
        (entity: LeaderEntity) => unassignLeader(leaderId, entity.type, entity.id),
        {
            onSuccess: (profile, entity) => {
                applyProfile(profile);
                Toast.show({ content: `Removed from ${entity.name}` });
            },
            onError: onFail('Failed to remove leader'),
        }
    );

    if (isLoading) {
        return <div className="bacenta-details-loading"><SpinLoading color="primary" /></div>;
    }

    if (error || !leader) {
        return (
            <div className="bacenta-details-page">
                <ErrorBlock status="default" title="Leader not found" description="They may have been removed." />
                <button className="bd-back-link" onClick={() => navigate('/dashboard/admin/leaders')}>Back to leaders</button>
            </div>
        );
    }

    const roleEntities = leader.role_entity_type
        ? leader.leading.filter((e) => e.type === leader.role_entity_type)
        : [];
    const canAssignMore =
        !!leader.role_entity_type &&
        (roleEntities.length === 0 || !SINGLE_ENTITY_TYPES.includes(leader.role_entity_type));

    const describeUnassign = (entities: LeaderEntity[]) =>
        entities.length === 0
            ? ''
            : ` They will be removed as leader of ${entities.map((e) => e.name).join(', ')}.`;

    const saveName = () => {
        const name = nameDraft.trim();
        if (!name || name === leader.name) {
            setEditingName(false);
            return;
        }
        nameMutation.mutate(name);
    };

    const confirmRoleChange = (role: string) => {
        if (role === leader.role) {
            setShowRolePicker(false);
            return;
        }
        Dialog.confirm({
            title: `Make ${leader.name} a ${role}?`,
            content: `Their role changes from ${leader.role || 'none'} to ${role}.${describeUnassign(roleEntities)}`,
            confirmText: 'Change role',
            cancelText: 'Cancel',
            onConfirm: () => roleMutation.mutateAsync(role).then(() => undefined, () => undefined),
        });
    };

    const confirmRemoveRole = () => {
        Dialog.confirm({
            title: `Remove ${leader.name}'s role?`,
            content: `They will no longer be a ${leader.role}.${describeUnassign(roleEntities)}`,
            confirmText: 'Remove role',
            cancelText: 'Cancel',
            onConfirm: () => roleMutation.mutateAsync(null).then(() => undefined, () => undefined),
        });
    };

    const confirmUnassign = (entity: LeaderEntity) => {
        Dialog.confirm({
            title: `Remove from ${entity.name}?`,
            content: `${entity.name} will have no leader. ${leader.name} keeps the ${leader.role || 'current'} role.`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            onConfirm: () => unassignMutation.mutateAsync(entity).then(() => undefined, () => undefined),
        });
    };

    const openAssign = (target: AssignTarget) => {
        setEntitySearch('');
        setAssignTarget(target);
    };

    const confirmAssign = (entity: { id: number; name: string; leader: { id: number; name: string } | null }) => {
        if (!assignTarget) return;
        const { type, from } = assignTarget;
        const displaced = entity.leader
            ? ` ${entity.leader.name} currently leads ${entity.name} and will be removed from it.`
            : '';
        Dialog.confirm({
            title: from ? `Move to ${entity.name}?` : `Assign to ${entity.name}?`,
            content: from
                ? `${leader.name} will stop leading ${from.name} and lead ${entity.name} instead.${displaced}`
                : `${leader.name} will lead ${entity.name}.${displaced}`,
            confirmText: from ? 'Move' : 'Assign',
            cancelText: 'Cancel',
            onConfirm: () =>
                assignMutation
                    .mutateAsync({ type, entity_id: entity.id, from_id: from?.id })
                    .then(() => undefined, () => undefined),
        });
    };

    const ledIds = new Set(leader.leading.map((e) => `${e.type}:${e.id}`));
    const term = entitySearch.trim().toLowerCase();
    const candidates = assignable.filter(
        (e) =>
            !ledIds.has(`${e.type}:${e.id}`) &&
            (!term || e.name.toLowerCase().includes(term) || e.context?.toLowerCase().includes(term))
    );

    return (
        <div className="bacenta-details-page">
            <header className="bd-header">
                <button className="bd-back" aria-label="Back" onClick={() => navigate('/dashboard/admin/leaders')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="bd-title">Leader Profile</h2>
            </header>

            <section className="bd-hero ld-hero">
                <div className="ld-avatar-wrap">
                    {leader.img_url ? (
                        <img src={leader.img_url} alt={leader.name} className="ld-avatar" />
                    ) : (
                        <div className="ld-avatar ld-avatar-initials">{getInitials(leader.name)}</div>
                    )}
                    {canEdit && (<>
                    <button
                        className="ld-avatar-edit"
                        aria-label="Change picture"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={pictureMutation.isLoading}
                    >
                        {pictureMutation.isLoading ? (
                            <SpinLoading style={{ '--size': '16px' } as React.CSSProperties} />
                        ) : (
                            <span className="material-symbols-outlined">photo_camera</span>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) pictureMutation.mutate(file);
                            e.target.value = '';
                        }}
                    />
                    </>)}
                </div>

                {editingName ? (
                    <div className="ld-name-edit">
                        <input
                            aria-label="Leader name"
                            value={nameDraft}
                            onChange={(e) => setNameDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveName();
                                if (e.key === 'Escape') setEditingName(false);
                            }}
                            autoFocus
                        />
                        <div className="ld-name-actions">
                            <button className="ld-chip-btn ghost" onClick={() => setEditingName(false)} disabled={nameMutation.isLoading}>
                                Cancel
                            </button>
                            <button className="ld-chip-btn solid" onClick={saveName} disabled={!nameDraft.trim() || nameMutation.isLoading}>
                                {nameMutation.isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="ld-name-row">
                        <h1>{leader.name}</h1>
                        {canEdit && (
                        <button
                            className="ld-icon-btn"
                            aria-label="Edit name"
                            onClick={() => {
                                setNameDraft(leader.name);
                                setEditingName(true);
                            }}
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        )}
                    </div>
                )}
                {(leader.email || leader.phone) && (
                    <p className="ld-contact">{[leader.phone, leader.email].filter(Boolean).join(' • ')}</p>
                )}
                {canGhost && leader.role !== 'Super Admin' && (
                    <button
                        className="ld-chip-btn ghost ld-ghost-btn"
                        onClick={() => confirmGhost(leader.name)}
                        disabled={ghostMutation.isLoading}
                    >
                        <span className="material-symbols-outlined">visibility</span>
                        {ghostMutation.isLoading ? 'Ghosting in...' : 'Ghost in'}
                    </button>
                )}
            </section>

            <section className="bd-card">
                <h3 className="bd-section-title">Role</h3>
                <div className="ld-role-row">
                    <span className={`ld-role-chip ${leader.role ? '' : 'none'}`}>{leader.role || 'No role'}</span>
                    {canEdit && (
                    <div className="ld-row-actions">
                        <button className="ld-text-btn" onClick={() => setShowRolePicker(true)} disabled={roleMutation.isLoading}>
                            {leader.role ? 'Change' : 'Assign role'}
                        </button>
                        {leader.role && (
                            <button className="ld-text-btn danger" onClick={confirmRemoveRole} disabled={roleMutation.isLoading}>
                                Remove
                            </button>
                        )}
                    </div>
                    )}
                </div>
            </section>

            <section className="bd-card">
                <h3 className="bd-section-title">Currently leading</h3>
                {leader.leading.length === 0 ? (
                    <p className="ld-empty">
                        {leader.role_entity_type
                            ? `Not assigned to a ${TYPE_LABEL[leader.role_entity_type].toLowerCase()} yet.`
                            : 'Not leading anything.'}
                    </p>
                ) : (
                    <ul className="ld-entity-list">
                        {leader.leading.map((entity) => (
                            <li key={`${entity.type}:${entity.id}`} className="ld-entity-row">
                                <span className="material-symbols-outlined ld-entity-icon">{TYPE_ICON[entity.type]}</span>
                                <div className="ld-entity-info">
                                    <span className="ld-entity-name">{entity.name}</span>
                                    <span className="ld-entity-meta">
                                        {TYPE_LABEL[entity.type]}{entity.context ? ` • ${entity.context}` : ''}
                                    </span>
                                </div>
                                {canEdit && (
                                <div className="ld-row-actions">
                                    {entity.type === leader.role_entity_type && (
                                        <button
                                            className="ld-icon-btn subtle"
                                            aria-label={`Move from ${entity.name}`}
                                            title="Move to another"
                                            onClick={() => openAssign({ type: entity.type, from: entity })}
                                        >
                                            <span className="material-symbols-outlined">swap_horiz</span>
                                        </button>
                                    )}
                                    <button
                                        className="ld-icon-btn subtle danger"
                                        aria-label={`Remove from ${entity.name}`}
                                        title="Remove"
                                        onClick={() => confirmUnassign(entity)}
                                        disabled={unassignMutation.isLoading}
                                    >
                                        <span className="material-symbols-outlined">link_off</span>
                                    </button>
                                </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                {canEdit && canAssignMore && leader.role_entity_type && (
                    <button className="bd-view-members-btn ld-assign-btn" onClick={() => openAssign({ type: leader.role_entity_type! })}>
                        <span className="material-symbols-outlined">add</span>
                        Assign {TYPE_LABEL[leader.role_entity_type].toLowerCase()}
                    </button>
                )}
            </section>

            {/* Role picker */}
            <Popup
                visible={showRolePicker}
                onMaskClick={() => setShowRolePicker(false)}
                bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70vh', overflowY: 'auto' }}
            >
                <div className="bd-members-popup">
                    <div className="bd-popup-header">
                        <h3>Choose a role</h3>
                        <button className="bd-popup-close" aria-label="Close" onClick={() => setShowRolePicker(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {roles.length === 0 ? (
                        <div className="bd-members-loading"><SpinLoading /></div>
                    ) : (
                        <ul className="bd-members-list">
                            {roles.map((role) => (
                                <li key={role.id}>
                                    <button className="ld-option" onClick={() => confirmRoleChange(role.name)}>
                                        <span>{role.name}</span>
                                        {role.name === leader.role && (
                                            <span className="material-symbols-outlined ld-check">check</span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Popup>

            {/* Assign / move picker */}
            <Popup
                visible={!!assignTarget}
                onMaskClick={() => setAssignTarget(null)}
                bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '75vh', overflowY: 'auto' }}
            >
                {assignTarget && (
                    <div className="bd-members-popup">
                        <div className="bd-popup-header">
                            <h3>
                                {assignTarget.from
                                    ? `Move from ${assignTarget.from.name}`
                                    : `Assign a ${TYPE_LABEL[assignTarget.type].toLowerCase()}`}
                            </h3>
                            <button className="bd-popup-close" aria-label="Close" onClick={() => setAssignTarget(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="ld-search">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                aria-label="Search"
                                placeholder={`Search ${TYPE_LABEL[assignTarget.type].toLowerCase()}s...`}
                                value={entitySearch}
                                onChange={(e) => setEntitySearch(e.target.value)}
                            />
                        </div>
                        {assignableLoading ? (
                            <div className="bd-members-loading"><SpinLoading /></div>
                        ) : candidates.length === 0 ? (
                            <p className="ld-empty">No {TYPE_LABEL[assignTarget.type].toLowerCase()}s found.</p>
                        ) : (
                            <ul className="bd-members-list">
                                {candidates.map((entity) => (
                                    <li key={entity.id}>
                                        <button
                                            className="ld-option"
                                            onClick={() => confirmAssign(entity)}
                                            disabled={assignMutation.isLoading}
                                        >
                                            <div className="ld-entity-info">
                                                <span className="ld-entity-name">{entity.name}</span>
                                                <span className="ld-entity-meta">
                                                    {entity.context ? `${entity.context} • ` : ''}
                                                    {entity.leader ? `Led by ${entity.leader.name}` : 'No leader'}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default LeaderDetails;
