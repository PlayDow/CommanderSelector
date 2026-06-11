import { useEffect, useState } from 'react';
import { commanderService } from '../services/api';
import { BRACKET_LABELS } from '../utils/brackets';

interface PlayDetail {
    id: number;
    commanderId: number;
    commanderName: string;
    imageUrl: string;
    bracket: string;
    playedAt: string;
    result: string | null;
    isVoided: boolean;
}

const History = () => {
    const [history, setHistory] = useState<PlayDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState<number | null>(null);

    useEffect(() => {
        commanderService.getHistory()
            .then(setHistory)
            .catch(() => setError("Impossible de charger l'historique."))
            .finally(() => setLoading(false));
    }, []);

    const saveResult = async (playId: number, result: 'win' | 'loss') => {
        setSaving(playId);
        try {
            await commanderService.updateResult(playId, result);
            setHistory(h => h.map(p => p.id === playId ? { ...p, result } : p));
        } catch { setError("Erreur enregistrement résultat."); }
        finally { setSaving(null); }
    };

    const voidPlay = async (playId: number) => {
        setSaving(playId);
        try {
            await commanderService.voidPlay(playId);
            setHistory(h => h.map(p => p.id === playId ? { ...p, isVoided: true, result: null } : p));
        } catch { setError("Erreur annulation."); }
        finally { setSaving(null); }
    };

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const resultBadge = (result: string | null, isVoided: boolean) => {
        if (isVoided) return <span style={{ backgroundColor: '#1f2937', color: '#4b5563', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0, border: '1px solid #374151' }}>⊘ Annulée</span>;
        if (result === 'win') return <span style={{ backgroundColor: '#166534', color: '#4ade80', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>🏆 Victoire</span>;
        if (result === 'loss') return <span style={{ backgroundColor: '#7f1d1d', color: '#f87171', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>💀 Défaite</span>;
        return null;
    };

    return (
        <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 1.25rem' }}>Historique des parties</h2>

            {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>}
            {error && <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>}
            {!loading && !error && history.length === 0 && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Aucune partie enregistrée.</p>
            )}

            {!loading && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {history.map((entry, index) => (
                        <div key={entry.id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            backgroundColor: entry.isVoided ? '#0f172a' : '#111827',
                            borderRadius: '0.5rem', padding: '0.6rem 0.75rem',
                            border: `1px solid ${entry.isVoided ? '#1e293b' : '#374151'}`,
                            flexWrap: 'wrap', opacity: entry.isVoided ? 0.6 : 1,
                        }}>
                            <span style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.85rem', minWidth: '1.75rem', textAlign: 'center', flexShrink: 0 }}>
                                #{history.length - index}
                            </span>
                            <img src={entry.imageUrl} alt={entry.commanderName}
                                style={{ width: '44px', borderRadius: '0.25rem', flexShrink: 0, filter: entry.isVoided ? 'grayscale(1)' : 'none' }} />
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <p style={{ color: entry.isVoided ? '#6b7280' : 'white', fontWeight: 'bold', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                                    {entry.commanderName}
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>{formatDate(entry.playedAt)}</p>
                            </div>

                            <span style={{ backgroundColor: '#78350f', color: '#fbbf24', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                                {BRACKET_LABELS[entry.bracket] ?? entry.bracket}
                            </span>

                            {resultBadge(entry.result, entry.isVoided)}

                            {/* Actions */}
                            {!entry.isVoided && !entry.result && (
                                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                    <button onClick={() => saveResult(entry.id, 'win')} disabled={saving === entry.id}
                                        style={{ padding: '0.25rem 0.6rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', opacity: saving === entry.id ? 0.6 : 1 }}>
                                        🏆 W
                                    </button>
                                    <button onClick={() => saveResult(entry.id, 'loss')} disabled={saving === entry.id}
                                        style={{ padding: '0.25rem 0.6rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', opacity: saving === entry.id ? 0.6 : 1 }}>
                                        💀 L
                                    </button>
                                    <button onClick={() => voidPlay(entry.id)} disabled={saving === entry.id}
                                        title="Annuler cette partie (reste dans l'historique mais le deck revient dans la roulette)"
                                        style={{ padding: '0.25rem 0.6rem', backgroundColor: '#374151', color: '#9ca3af', border: '1px solid #4b5563', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.75rem', opacity: saving === entry.id ? 0.6 : 1 }}>
                                        ⊘
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
