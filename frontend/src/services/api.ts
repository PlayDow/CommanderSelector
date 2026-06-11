import type { Commander, Play } from "../types";

const API_URL = "/api/Commander";
const AUTH_URL = "/api/User";
const ADMIN_URL = "/api/Admin";
const COMMUNITY_URL = "/api/Community";
const SCRYFALL_API = "https://api.scryfall.com/cards/search";

const getUserId = (): number => parseInt(localStorage.getItem('mtg_userId') ?? '0', 10);

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Id': String(getUserId())
});

// ─── Auth ────────────────────────────────────────────────────
export const authService = {
    login: async (username: string, password: string) => {
        const res = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
        const data = await res.json();
        localStorage.setItem('mtg_userId', String(data.userId));
        localStorage.setItem('mtg_username', data.username);
        localStorage.setItem('mtg_isAdmin', String(data.isAdmin));
        localStorage.setItem('mtg_tags', JSON.stringify(data.tags ?? []));
        return data;
    },
    register: async (username: string, password: string): Promise<string> => {
        const res = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
        return (await res.json()).recoveryCode;
    },
    recover: async (username: string, recoveryCode: string, newPassword: string): Promise<string> => {
        const res = await fetch(`${AUTH_URL}/recover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, recoveryCode, newPassword })
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
        return (await res.json()).newRecoveryCode;
    },
    logout: () => ['mtg_userId','mtg_username','mtg_isAdmin','mtg_tags'].forEach(k => localStorage.removeItem(k)),
    isLoggedIn: () => getUserId() > 0,
    getUsername: () => localStorage.getItem('mtg_username') ?? '',
    isAdmin: () => localStorage.getItem('mtg_isAdmin') === 'true',
    getTags: (): {id:number,name:string}[] => {
        try { return JSON.parse(localStorage.getItem('mtg_tags') ?? '[]'); }
        catch { return []; }
    },
};

// ─── Commanders ──────────────────────────────────────────────
export const commanderService = {
    getLibrary: async (bracket?: string): Promise<Commander[]> => {
        const url = bracket ? `${API_URL}/lib?bracket=${bracket}` : `${API_URL}/lib`;
        return (await fetch(url, { headers: authHeaders() })).json();
    },
    getRoulettePool: async (bracket: string, excludeCount: number): Promise<Commander[]> =>
        (await fetch(`${API_URL}/roulette?bracket=${bracket}&excludeCount=${excludeCount}`, { headers: authHeaders() })).json(),

    addCommander: async (commander: Commander): Promise<void> => {
        const res = await fetch(API_URL, { method: 'POST', headers: authHeaders(), body: JSON.stringify(commander) });
        if (!res.ok) throw new Error(await res.text());
    },
    updateCommander: async (id: number, commander: Partial<Commander>): Promise<void> => {
        await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(commander) });
    },
    deleteCommander: async (id: number): Promise<void> => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: authHeaders() });
    },
    toggleActive: async (id: number): Promise<void> => {
        await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH', headers: authHeaders() });
    },
    recordPlay: async (play: Play): Promise<void> => {
        const res = await fetch(`${API_URL}/record-play`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(play) });
        if (!res.ok) throw new Error('Erreur enregistrement partie');
    },
    updateResult: async (playId: number, result: 'win' | 'loss'): Promise<void> => {
        await fetch(`${API_URL}/play/${playId}/result`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ result }) });
    },
    voidPlay: async (playId: number): Promise<void> => {
        await fetch(`${API_URL}/play/${playId}/void`, { method: 'PATCH', headers: authHeaders() });
    },
    getHistory: async (): Promise<any[]> => {
        const res = await fetch(`${API_URL}/history`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur historique');
        return res.json();
    },
    getStats: async (): Promise<any[]> => {
        const res = await fetch(`${API_URL}/stats`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur stats');
        return res.json();
    },
    searchScryfall: async (term: string): Promise<any[]> => {
        if (term.length < 3) return [];
        try {
            const res = await fetch(`${SCRYFALL_API}?q=${encodeURIComponent(term)}+is:commander`);
            const data = await res.json();
            return data.data ? data.data.slice(0, 5) : [];
        } catch { return []; }
    }
};

// ─── Admin ───────────────────────────────────────────────────
export const adminService = {
    getUsers: async (): Promise<any[]> => {
        const res = await fetch(`${ADMIN_URL}/users`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Accès refusé');
        return res.json();
    },
    setAdmin: async (targetId: number, isAdmin: boolean): Promise<void> => {
        await fetch(`${ADMIN_URL}/users/${targetId}/admin`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ isAdmin }) });
    },
    getTags: async (): Promise<any[]> => {
        const res = await fetch(`${ADMIN_URL}/tags`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur tags');
        return res.json();
    },
    createTag: async (name: string): Promise<void> => {
        await fetch(`${ADMIN_URL}/tags`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name }) });
    },
    deleteTag: async (tagId: number): Promise<void> => {
        await fetch(`${ADMIN_URL}/tags/${tagId}`, { method: 'DELETE', headers: authHeaders() });
    },
    assignTag: async (userId: number, tagId: number): Promise<void> => {
        await fetch(`${ADMIN_URL}/users/${userId}/tags/${tagId}`, { method: 'POST', headers: authHeaders() });
    },
    removeTag: async (userId: number, tagId: number): Promise<void> => {
        await fetch(`${ADMIN_URL}/users/${userId}/tags/${tagId}`, { method: 'DELETE', headers: authHeaders() });
    },
};

// ─── Community ───────────────────────────────────────────────
export const communityService = {
    getMyTags: async (): Promise<any[]> => {
        const res = await fetch(`${COMMUNITY_URL}/my-tags`, { headers: authHeaders() });
        if (!res.ok) return [];
        return res.json();
    },
    getCommanders: async (tagId: number, bracket?: string): Promise<any[]> => {
        const url = bracket ? `${COMMUNITY_URL}/${tagId}/commanders?bracket=${bracket}` : `${COMMUNITY_URL}/${tagId}/commanders`;
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur communauté');
        return res.json();
    },
    getMembers: async (tagId: number): Promise<any[]> => {
        const res = await fetch(`${COMMUNITY_URL}/${tagId}/members`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur membres');
        return res.json();
    },
    draw: async (tagId: number, bracket: string, excludeCount: number, playerIds: number[]): Promise<any[]> => {
        const res = await fetch(`${COMMUNITY_URL}/${tagId}/draw`, {
            method: 'POST', headers: authHeaders(),
            body: JSON.stringify({ bracket, excludeCount, playerIds })
        });
        if (!res.ok) throw new Error('Erreur tirage');
        return res.json();
    },
    recordResult: async (tagId: number, winnerUserId: number, playerIds: number[], playIds: number[]): Promise<void> => {
        await fetch(`${COMMUNITY_URL}/${tagId}/result`, {
            method: 'POST', headers: authHeaders(),
            body: JSON.stringify({ winnerUserId, playerIds, playIds })
        });
    },
};
