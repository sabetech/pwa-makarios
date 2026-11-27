// Single place for the auth session kept in localStorage.
// The axios interceptor reads `token` on every request, so swapping it here
// switches who the app acts as.

const TOKEN = 'token';
const USER = 'user';
const IMPERSONATOR_TOKEN = 'impersonator_token';
const IMPERSONATOR_USER = 'impersonator_user';

export interface ApiUser {
    roles?: Array<{ name: string; permissions?: Array<{ name: string }> }>;
}

export const saveSession = (token: string, user: ApiUser) => {
    localStorage.setItem(TOKEN, token);
    // Map the first role and its permissions for convenience.
    const role = user.roles?.[0]?.name || 'User';
    const permissions = user.roles?.[0]?.permissions?.map(p => p.name) || [];
    localStorage.setItem(USER, JSON.stringify({ ...user, role, permissions }));
};

const parse = (raw: string | null) => {
    if (!raw || raw === 'undefined') return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const getStoredUser = () => parse(localStorage.getItem(USER));

export const ADMIN_ROLES = ['Super Admin', 'General Admin', 'Bishop'];

/** Top-level admins; everyone else gets read-only, scoped views. */
export const isAdmin = () => ADMIN_ROLES.includes(getStoredUser()?.role);

export const isGhosting = () => localStorage.getItem(IMPERSONATOR_TOKEN) !== null;

export const getImpersonator = () => parse(localStorage.getItem(IMPERSONATOR_USER));

/** Stash the admin's session and switch to the ghosted user's. */
export const startGhost = (token: string, user: ApiUser) => {
    // Never overwrite the stash: ghosting from inside a ghost session would
    // otherwise lose the real admin session.
    if (!isGhosting()) {
        localStorage.setItem(IMPERSONATOR_TOKEN, localStorage.getItem(TOKEN) ?? '');
        localStorage.setItem(IMPERSONATOR_USER, localStorage.getItem(USER) ?? '');
    }
    saveSession(token, user);
};

/** Restore the admin's session. */
export const endGhost = () => {
    // No-op outside ghost mode, so a second call can't wipe the admin session.
    if (!isGhosting()) return;
    const token = localStorage.getItem(IMPERSONATOR_TOKEN);
    const user = localStorage.getItem(IMPERSONATOR_USER);
    if (token) localStorage.setItem(TOKEN, token); else localStorage.removeItem(TOKEN);
    if (user) localStorage.setItem(USER, user); else localStorage.removeItem(USER);
    localStorage.removeItem(IMPERSONATOR_TOKEN);
    localStorage.removeItem(IMPERSONATOR_USER);
};

export const clearSession = () => {
    [TOKEN, USER, IMPERSONATOR_TOKEN, IMPERSONATOR_USER].forEach(k => localStorage.removeItem(k));
};
