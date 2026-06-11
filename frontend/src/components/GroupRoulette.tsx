import { useEffect, useState } from 'react';
import { communityService } from '../services/api';
import { BRACKETS, BRACKET_LABELS } from '../utils/brackets';
import { authService } from '../services/api';

interface Tag { id: number; name: string; }
interface Member { id: number; userName: string; }
interface DrawEntry { userId: number; userName: string; commanderId: number | null; commanderName: string; imageUrl: string; bracket: string; playId: number | null; }

const EXCLUDE_KEY = 'mtg_group_excludeCount';

const GroupRoulette = () => {
    const [myTags, setMyTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [bracket, setBracket] = useState('3Fa');
    const [excludeCount, setExcludeCount] = useState(() => parseInt(localStorage.getItem(EXCLUDE_KEY) ?? '3', 10));
    const [results, setResults] = useState<DrawEntry[]>([]);
    const [drawing, setDrawing] = useState(false);
    const [winner, setWinner] = useState<number | null>(null);
    const [resultSaved, setResultSaved] = useState(false);
    const [error, setError] = useState('');

    const currentUserId = parseInt(localStorage.getItem('mtg_userId') ?? '0', 10);

    useEffect(() => {
        communityService.getMyTags().then(tags => {
            setMyTags(tags);
            if (tags.length === 1) setSelectedTag(tags[0]);
        });
    }, []);

    useEffect(() => {
        if (!selectedTag) return;
        communityService.getMembers(selectedTag.id).then(m => {
            setMembers(m);
            setSelectedPlayers([]);
            setResults([]);
        });
    }, [selectedTag]);

    const togglePlayer = (id: number) => {
        setSelectedPlayers(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 8 ? [...prev, id] : prev
        );
    };

    const handleExclude = (v: number) => { setExcludeCount(v); localStorage.setItem(EXCLUDE_KEY, String(v)); };

    const draw = async () => {
        if (!selectedTag || selectedPlayers.length < 2) return;
        setDrawing(true); setResults([]); setWinner(null); setResultSaved(false); setError('');
        try {
            const data = await communityService.draw(selectedTag.id, bracket, excludeCount, selectedPlayers);
            setResults(data);
        } catch { setError('Erreur lors du tirage.'); }
        finally { setDrawing(false); }
    };

    const saveResult = async (winnerUserId: number) => {
        if (!selectedTag) return;
        const playerIds = results.map(r => r.userId);
        const playIds = results.map(r => r.playId).filter(Boolean) as number[];
        await communityService.recordResult(selectedTag.id, winnerUserId, playerIds, playIds);
        setWinner(winnerUserId);
        setResultSaved(true);
    };

    const sel: React.CSSProperties = { padding: '0.4rem 0.6rem', borderRadius: '0.25rem', backgroundColor: '#111827', color: 'white', border: '1px solid #4b5563', outline: 'none', fontSize: '0.9rem' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#1f2937', padding: '1.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: '900', color: '#eab308', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                Roulette de Groupe
            </h2>

            {myTags.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center' }}>Tu n'appartiens à aucun groupe.</p>}

            {/* Sélection tag */}
            {myTags.length > 1 && (
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {myTags.map(tag => (
                        <button key={tag.id} onClick={() => setSelectedTag(tag)} style={{
                            padding: '0.35rem 0.9rem', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.8rem',
                            border: 'none', cursor: 'pointer',
                            backgroundColor: selectedTag?.id === tag.id ? '#1d4ed8' : '#374151',
                            color: selectedTag?.id === tag.id ? 'white' : '#9ca3af',
                        }}>{tag.name}</button>
                    ))}
                </div>
            )}

            {selectedTag && (
                <>
                    {/* Paramètres */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <label style={{ color: '#d1d5db', fontWeight: 'bold', fontSize: '0.85rem' }}>Bracket :</label>
                            <select value={bracket} onChange={e => setBracket(e.target.value)} style={sel}>
                                {BRACKETS.map(b => <option key={b} value={b}>{BRACKET_LABELS[b]}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <label style={{ color: '#d1d5db', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                Exclure les <span style={{ color: '#fbbf24' }}>{excludeCount}</span> derniers :
                            </label>
                            <input type="range" min={0} max={15} value={excludeCount} onChange={e => handleExclude(Number(e.target.value))} style={{ width: '80px', accentColor: '#ca8a04' }} />
                        </div>
                    </div>

                    {/* Sélection joueurs */}
                    <div>
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 0.5rem', textAlign: 'center' }}>
                            Sélectionne 2 à 8 joueurs
                        </p>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {members.map(m => {
                                const selected = selectedPlayers.includes(m.id);
                                const isMe = m.id === currentUserId;
                                return (
                                    <button key={m.id} onClick={() => togglePlayer(m.id)} style={{
                                        padding: '0.4rem 0.9rem', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.85rem',
                                        border: isMe ? '2px solid #ca8a04' : '1px solid #374151', cursor: 'pointer',
                                        backgroundColor: selected ? '#1d4ed8' : '#374151',
                                        color: selected ? 'white' : '#9ca3af',
                                    }}>
                                        {m.userName}{isMe ? ' (moi)' : ''}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bouton tirage */}
                    {results.length === 0 && (
                        <button onClick={draw} disabled={drawing || selectedPlayers.length < 2} style={{
                            alignSelf: 'center', padding: '0.9rem 2.5rem', backgroundColor: selectedPlayers.length < 2 ? '#374151' : '#ca8a04',
                            color: selectedPlayers.length < 2 ? '#6b7280' : '#111827',
                            borderRadius: '9999px', fontWeight: '900', fontSize: '1.1rem', border: 'none',
                            cursor: selectedPlayers.length < 2 ? 'not-allowed' : 'pointer',
                        }}>
                            {drawing ? 'Tirage...' : selectedPlayers.length < 2 ? 'Sélectionne 2+ joueurs' : 'TIRER LES DECKS'}
                        </button>
                    )}

                    {error && <p style={{ color: '#f87171', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

                    {/* Résultats du tirage */}
                    {results.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.85rem', margin: 0 }}>
                                {resultSaved ? '✓ Résultats enregistrés !' : 'Désigne le vainqueur :'}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {results.map(r => (
                                    <div key={r.userId} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                        backgroundColor: winner === r.userId ? '#14532d' : winner !== null ? '#1a1a2e' : '#111827',
                                        border: `2px solid ${winner === r.userId ? '#16a34a' : winner !== null ? '#1f2937' : '#374151'}`,
                                        borderRadius: '0.75rem', padding: '0.75rem', minWidth: '120px',
                                        transition: 'all 0.2s', opacity: winner !== null && winner !== r.userId ? 0.5 : 1,
                                    }}>
                                        <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.85rem', margin: 0 }}>{r.userName}</p>
                                        {r.imageUrl ? (
                                            <img src={r.imageUrl} alt={r.commanderName} style={{ width: '90px', borderRadius: '0.4rem' }} />
                                        ) : (
                                            <div style={{ width: '90px', height: '120px', backgroundColor: '#374151', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center', padding: '0.5rem' }}>Aucun deck dispo</span>
                                            </div>
                                        )}
                                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem', margin: 0, textAlign: 'center' }}>{r.commanderName}</p>
                                        {winner === r.userId && <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.85rem' }}>🏆 Vainqueur !</span>}
                                        {!resultSaved && r.commanderId && (
                                            <button onClick={() => saveResult(r.userId)} style={{ padding: '0.3rem 0.75rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                🏆 Vainqueur
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!resultSaved && (
                                <button onClick={() => setResultSaved(true)} style={{ alignSelf: 'center', padding: '0.4rem 1rem', backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #374151', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                    Passer sans enregistrer
                                </button>
                            )}

                            <button onClick={() => { setResults([]); setWinner(null); setResultSaved(false); }} style={{ alignSelf: 'center', padding: '0.75rem 2rem', backgroundColor: '#ca8a04', color: '#111827', borderRadius: '9999px', fontWeight: '900', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                                NOUVEAU TIRAGE
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupRoulette;
