import { useEffect, useState } from 'react';
import { commanderService } from '../services/api';
import type { Commander } from '../types';

const CommanderList = ({ refreshKey }: { refreshKey: number }) => {
    const [commanders, setCommanders] = useState<Commander[]>([]);
    const [filter, setFilter] = useState<number | undefined>(undefined);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        commanderService.getLibrary(filter)
            .then(setCommanders)
            .catch(e => console.error('Erreur chargement', e));
    }, [filter, refreshKey]);

    return (
        <div style={{
            backgroundColor: '#1f2937', padding: '1.25rem',
            borderRadius: '0.75rem', border: '1px solid #374151',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Ma Collection</h2>
                <select onChange={e => setFilter(e.target.value ? Number(e.target.value) : undefined)} style={{
                    padding: '0.4rem 0.6rem', borderRadius: '0.25rem',
                    backgroundColor: '#111827', color: 'white', border: '1px solid #4b5563', outline: 'none',
                    fontSize: '0.85rem',
                }}>
                    <option value="">Tous les Brackets</option>
                    {[1, 2, 3, 4, 5].map(b => <option key={b} value={b}>Bracket {b}</option>)}
                </select>
            </div>

            {commanders.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Aucun commandant trouvé.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.75rem',
                }}>
                    {commanders.map(c => (
                        <div key={c.id} style={{
                            position: 'relative', borderRadius: '0.4rem', overflow: 'hidden',
                            border: `1px solid ${hoveredId === c.id ? '#eab308' : '#374151'}`,
                            transition: 'border-color 0.2s', cursor: 'default',
                        }}
                            onMouseEnter={() => setHoveredId(c.id ?? null)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <img src={c.imageUrl} alt={c.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                backgroundColor: 'rgba(0,0,0,0.88)', padding: '0.4rem 0.3rem',
                                transform: hoveredId === c.id ? 'translateY(0)' : 'translateY(100%)',
                                transition: 'transform 0.2s',
                            }}>
                                <p style={{
                                    fontSize: '0.7rem', color: 'white', textAlign: 'center',
                                    fontWeight: 'bold', margin: '0 0 2px',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>{c.name}</p>
                                <p style={{ color: '#eab308', fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
                                    Bracket {c.bracket}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommanderList;
