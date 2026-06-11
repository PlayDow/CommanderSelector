import { useEffect, useState } from 'react';
import { commanderService } from '../services/api';
import { BRACKET_LABELS, BRACKETS } from '../utils/brackets';

interface CommanderStats {
    commanderId: number;
    commanderName: string;
    imageUrl: string;
    bracket: string;
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
}

const Stats = () => {
    const [stats, setStats] = useState<CommanderStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState<'winRate' | 'totalGames' | 'bracket'>('bracket');

    useEffect(() => {
        commanderService.getStats()
            .then(setStats)
            .catch(() => setError('Impossible de charger les statistiques.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = [...stats]
        .filter(s => !filter || s.bracket === filter)
        .sort((a, b) => {
            if (sort === 'winRate') return b.winRate - a.winRate;
            if (sort === 'totalGames') return b.totalGames - a.totalGames;
            return BRACKETS.indexOf(a.bracket as any) - BRACKETS.indexOf(b.bracket as any);
        });

    const winRateColor = (rate: number) => {
        if (rate >= 60) return '#4ade80';
        if (rate >= 40) return '#fbbf24';
        return '#f87171';
    };

    const sel: React.CSSProperties = { padding: '0.4rem 0.6rem', borderRadius: '0.25rem', backgroundColor: '#111827', color: 'white', border: '1px solid #4b5563', outline: 'none', fontSize: '0.85rem' };

    return (
        <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Mes Statistiques</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select onChange={e => setFilter(e.target.value)} style={sel}>
                        <option value="">Tous les Brackets</option>
                        {BRACKETS.map(b => <option key={b} value={b}>{BRACKET_LABELS[b]}</option>)}
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value as any)} style={sel}>
                        <option value="bracket">Trier par Bracket</option>
                        <option value="winRate">Trier par Win Rate</option>
                        <option value="totalGames">Trier par Parties</option>
                    </select>
                </div>
            </div>

            {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>}
            {error && <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Aucune statistique disponible. Joue des parties et enregistre les résultats !</p>
            )}

            {!loading && filtered.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filtered.map(s => (
                        <div key={s.commanderId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#111827', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', border: '1px solid #374151', flexWrap: 'wrap' }}>
                            <img src={s.imageUrl} alt={s.commanderName} style={{ width: '44px', borderRadius: '0.25rem', flexShrink: 0 }} />

                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <p style={{ color: 'white', fontWeight: 'bold', margin: '0 0 2px', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.commanderName}</p>
                                <span style={{ backgroundColor: '#78350f', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {BRACKET_LABELS[s.bracket] ?? s.bracket}
                                </span>
                            </div>

                            {/* Stats chiffres */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#9ca3af', fontSize: '0.65rem', margin: '0 0 2px', textTransform: 'uppercase' }}>Parties</p>
                                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{s.totalGames}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#9ca3af', fontSize: '0.65rem', margin: '0 0 2px', textTransform: 'uppercase' }}>V</p>
                                    <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{s.wins}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#9ca3af', fontSize: '0.65rem', margin: '0 0 2px', textTransform: 'uppercase' }}>D</p>
                                    <p style={{ color: '#f87171', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{s.losses}</p>
                                </div>

                                {/* Win rate bar */}
                                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                    <p style={{ color: '#9ca3af', fontSize: '0.65rem', margin: '0 0 4px', textTransform: 'uppercase' }}>Win Rate</p>
                                    <div style={{ backgroundColor: '#374151', borderRadius: '9999px', height: '6px', width: '60px', overflow: 'hidden' }}>
                                        <div style={{ backgroundColor: winRateColor(s.winRate), height: '100%', width: `${s.winRate}%`, transition: 'width 0.3s' }} />
                                    </div>
                                    <p style={{ color: winRateColor(s.winRate), fontWeight: 'bold', fontSize: '0.85rem', margin: '2px 0 0' }}>{s.winRate}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stats;
