import { stopImpersonation } from '../../api/auth';
import { endGhost, getStoredUser } from '../../utils/authStorage';

/** Leave ghost mode and go back to the ghosted user's profile as the admin. */
export const exitGhost = async () => {
    const ghostedId = getStoredUser()?.id;
    try {
        await stopImpersonation();
    } catch {
        // The ghost token expires on its own; still restore the admin session.
    }
    endGhost();
    window.location.assign(ghostedId ? `/dashboard/admin/leaders/${ghostedId}` : '/dashboard');
};
