import { useEffect, useState } from 'react';
import { commanderService } from '../services/api';

interface HistoryEntry {
    id: number;
    commanderId: number;
    commanderName: string;
    imageUrl: string;
    bracket: number;
    playedAt: string;
}

const History = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rawError, setRawError] = useState('');

    useEffect(() => {
        fetch('/api/Commander/history', {
            headers: {
                'X-User-Id': String(localStorage.getItem('mtg_userId') ?? '0'),
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    setRawError(`${res.status} — ${text}`);
                    throw new Error('Erreur serveur');
                }
                return res.json();
            })
            .then(setHistory)
            .catch(() => setError("Impossible de charger l'historique."))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <div style={{
            backgroundColor: '#1f2937', padding: '1.25rem',
            borderRadius: '0.75rem', border: '1px solid #374151',
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 1.25rem' }}>
                Historique des parties
            </h2>

            {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>}

            {error && (
                <div>
                    <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>
                    {rawError && (
                        <pre style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                            {rawError}
                        </pre>
                    )}
                </div>
            )}

            {!loading && !error && history.length === 0 && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>
                    Aucune partie enregistrée. Lance la roulette et confirme un commandant !
                </p>
            )}

            {!loading && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {history.map((entry, index) => (
                        <div key={entry.id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            backgroundColor: '#111827', borderRadius: '0.5rem',
                            padding: '0.6rem 0.75rem', border: '1px solid #374151',
                            flexWrap: 'wrap',
                        }}>
                            <span style={{
                                color: '#4b5563', fontWeight: 'bold', fontSize: '0.85rem',
                                minWidth: '1.75rem', textAlign: 'center', flexShrink: 0,
                            }}>
                                #{history.length - index}
                            </span>
                            <img src={entry.imageUrl} alt={entry.commanderName}
                                style={{ width: '44px', borderRadius: '0.25rem', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <p style={{
                                    color: 'white', fontWeight: 'bold', margin: '0 0 2px',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    fontSize: '0.9rem',
                                }}>{entry.commanderName}</p>
                                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>
                                    {formatDate(entry.playedAt)}
                                </p>
                            </div>
                            <span style={{
                                backgroundColor: '#78350f', color: '#fbbf24',
                                padding: '0.2rem 0.6rem', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0,
                            }}>
                                Bracket {entry.bracket}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
