import { useState } from 'react';
import { getImpersonator, getStoredUser, isGhosting } from '../../utils/authStorage';
import { exitGhost } from './exitGhost';
import './GhostBanner.css';

const GhostBanner = () => {
    const [exiting, setExiting] = useState(false);

    if (!isGhosting()) return null;

    const user = getStoredUser();
    const admin = getImpersonator();

    const handleExit = async () => {
        setExiting(true);
        await exitGhost();
    };

    return (
        <div className="ghost-banner" role="status">
            <span className="material-symbols-outlined ghost-banner-icon" aria-hidden="true">visibility</span>
            <p className="ghost-banner-text">
                Viewing as <strong>{user?.name ?? 'user'}</strong>
                {user?.role && <span className="ghost-banner-role"> · {user.role}</span>}
                {admin?.name && <span className="ghost-banner-admin"> (you are {admin.name})</span>}
            </p>
            <button className="ghost-banner-exit" onClick={handleExit} disabled={exiting}>
                {exiting ? 'Exiting...' : 'Exit'}
            </button>
        </div>
    );
};

export default GhostBanner;
