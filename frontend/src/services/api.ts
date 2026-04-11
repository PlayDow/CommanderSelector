import type { Commander, Play } from "../types";

const API_URL = "http://localhost:5000/api/Commander";
const AUTH_URL = "http://localhost:5000/api/User";
const SCRYFALL_API = "https://api.scryfall.com/cards/search";

// Récupère le userId stocké après login
const getUserId = (): number => {
    return parseInt(localStorage.getItem('mtg_userId') ?? '0', 10);
};

// Header auth envoyé à chaque requête protégée
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Id': String(getUserId())
});

export const authService = {
    login: async (username: string, password: string): Promise<{ userId: number; username: string }> => {
        const res = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message ?? 'Erreur de connexion');
        }
        const data = await res.json();
        localStorage.setItem('mtg_userId', String(data.userId));
        localStorage.setItem('mtg_username', data.username);
        return { userId: data.userId, username: data.username };
    },

    register: async (username: string, password: string): Promise<string> => {
        const res = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message ?? 'Erreur inscription');
        }
        const data = await res.json();
        return data.recoveryCode as string; // à afficher une seule fois
    },

    recover: async (username: string, recoveryCode: string, newPassword: string): Promise<string> => {
        const res = await fetch(`${AUTH_URL}/recover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, recoveryCode, newPassword })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message ?? 'Code incorrect');
        }
        const data = await res.json();
        return data.newRecoveryCode as string;
    },

    logout: () => {
        localStorage.removeItem('mtg_userId');
        localStorage.removeItem('mtg_username');
    },

    isLoggedIn: () => getUserId() > 0,
    getUsername: () => localStorage.getItem('mtg_username') ?? '',
};

export const commanderService = {
    getLibrary: async (bracket?: number): Promise<Commander[]> => {
        const url = bracket ? `${API_URL}/lib?bracket=${bracket}` : `${API_URL}/lib`;
        const res = await fetch(url, { headers: authHeaders() });
        return res.json();
    },

    getRoulettePool: async (bracket: number, excludeCount: number): Promise<Commander[]> => {
        const res = await fetch(`${API_URL}/roulette?bracket=${bracket}&excludeCount=${excludeCount}`, { headers: authHeaders() });
        return res.json();
    },

    getHistory: async (): Promise<any[]> => {
        const res = await fetch(`${API_URL}/history`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Erreur chargement historique');
        return res.json();
    },

    addCommander: async (commander: Commander): Promise<void> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(commander)
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erreur ${res.status} : ${errorText}`);
        }
    },

    updateCommander: async (commander: Commander): Promise<void> => {
        await fetch(API_URL, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(commander)
        });
    },

    deleteCommander: async (id: number): Promise<void> => {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
    },

    recordPlay: async (play: Play): Promise<void> => {
        const res = await fetch(`${API_URL}/record-play`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(play)
        });
        if (!res.ok) throw new Error('Erreur enregistrement partie');
    },

    searchScryfall: async (searchTerm: string): Promise<any[]> => {
        if (searchTerm.length < 3) return [];
        try {
            const res = await fetch(`${SCRYFALL_API}?q=${searchTerm}+is:commander`);
            const data = await res.json();
            return data.data ? data.data.slice(0, 5) : [];
        } catch {
            return [];
        }
    }
};
