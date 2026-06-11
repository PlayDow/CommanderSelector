import { useEffect, useState } from 'react';
import { communityService } from '../services/api';
import { BRACKETS, BRACKET_SHORT } from '../utils/brackets';

interface Tag { id: number; name: string; }
interface CommunityEntry { userName: string; userId: number; commanderId: number; commanderName: string; imageUrl: string; bracket: string; isActive: boolean; }
interface Tooltip { src: string; name: string; x: number; y: number; }

const Community = () => {
    const [myTags, setMyTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [data, setData] = useState<CommunityEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tooltip, setTooltip] = useState<Tooltip | null>(null);

    useEffect(() => {
        communityService.getMyTags().then(tags => {
            setMyTags(tags);
            if (tags.length === 1) setSelectedTag(tags[0]);
        });
    }, []);

    useEffect(() => {
        if (!selectedTag) return;
        setLoading(true); setError('');
        communityService.getCommanders(selectedTag.id)
            .then(setData)
            .catch(() => setError('Impossible de charger les données.'))
            .finally(() => setLoading(false));
    }, [selectedTag]);

    const players = [...new Set(data.map(d => d.userName))].sort();
    const activeBrackets = BRACKETS.filter(b => data.some(d => d.bracket === b));
    const getCommanders = (player: string, bracket: string) => data.filter(d => d.userName === player && d.bracket === bracket);

    const thStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', textAlign: 'center', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.8rem', borderBottom: '2px solid #374151', whiteSpace: 'nowrap', backgroundColor: '#0f172a' };
    const tdStyle: React.CSSProperties = { padding: '0.5rem', verticalAlign: 'top', borderBottom: '1px solid #1f2937', borderRight: '1px solid #1f2937', minWidth: '130px' };

    return (
        <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>

            {/* Header + sélecteur de tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Communauté</h2>

                {myTags.length === 0 && (
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Tu n'appartiens à aucun groupe.</p>
                )}

                {myTags.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {myTags.map(tag => (
                            <button key={tag.id} onClick={() => setSelectedTag(tag)} style={{
                                padding: '0.35rem 0.9rem', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.8rem',
                                border: 'none', cursor: 'pointer',
                                backgroundColor: selectedTag?.id === tag.id ? '#1d4ed8' : '#374151',
                                color: selectedTag?.id === tag.id ? 'white' : '#9ca3af',
                            }}>
                                {tag.name}
                            </button>
                        ))}
                    </div>
                )}

                {myTags.length === 1 && (
                    <span style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {myTags[0].name}
                    </span>
                )}
            </div>

            {!selectedTag && myTags.length > 0 && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Sélectionne un groupe.</p>
            )}

            {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>}
            {error && <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>}

            {!loading && selectedTag && players.length === 0 && !error && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Aucun membre avec des commandants.</p>
            )}

            {!loading && players.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, textAlign: 'left', minWidth: '100px', position: 'sticky', left: 0 }}>Joueur</th>
                                {activeBrackets.map(b => <th key={b} style={thStyle}>{BRACKET_SHORT[b]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player}>
                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#e2e8f0', backgroundColor: '#1a2332', verticalAlign: 'middle', position: 'sticky', left: 0 }}>
                                        {player}
                                    </td>
                                    {activeBrackets.map(b => {
                                        const cmds = getCommanders(player, b);
                                        return (
                                            <td key={b} style={{ ...tdStyle, backgroundColor: '#111827' }}>
                                                {cmds.length === 0 ? (
                                                    <span style={{ color: '#374151', fontSize: '0.75rem' }}>—</span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                        {cmds.map(c => (
                                                            <div key={c.commanderId}
                                                                style={{ opacity: c.isActive ? 1 : 0.35 }}
                                                                onMouseEnter={e => {
                                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                                    setTooltip({ src: c.imageUrl, name: c.commanderName, x: rect.left, y: rect.bottom });
                                                                }}
                                                                onMouseLeave={() => setTooltip(null)}>
                                                                <img src={c.imageUrl} alt={c.commanderName}
                                                                    style={{ width: '50px', borderRadius: '0.25rem', display: 'block', border: c.isActive ? '1px solid #374151' : '1px solid #450a0a' }} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tooltip && (
                <div style={{ position: 'fixed', left: tooltip.x, top: tooltip.y + 8, zIndex: 1000, pointerEvents: 'none', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.8))' }}>
                    <img src={tooltip.src} alt={tooltip.name} style={{ width: '180px', borderRadius: '0.75rem' }} />
                    <p style={{ color: 'white', textAlign: 'center', fontSize: '0.8rem', margin: '0.25rem 0 0', fontWeight: 'bold', textShadow: '0 1px 3px black' }}>{tooltip.name}</p>
                </div>
            )}
        </div>
    );
};

export default Community;
