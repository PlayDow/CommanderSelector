import { useEffect, useState } from 'react';
import { commanderService } from '../services/api';
import { BRACKETS, BRACKET_LABELS } from '../utils/brackets';
import type { Commander } from '../types';

const CommanderList = ({ refreshKey }: { refreshKey: number }) => {
    const [commanders, setCommanders] = useState<Commander[]>([]);
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editBracket, setEditBracket] = useState('3Fa');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const load = () => commanderService.getLibrary(filter).then(setCommanders).catch(console.error);

    useEffect(() => { load(); }, [filter, refreshKey]);

    const handleToggle = async (c: Commander) => {
        await commanderService.toggleActive(c.id!);
        load();
    };

    const handleDelete = async (id: number) => {
        await commanderService.deleteCommander(id);
        setConfirmDeleteId(null);
        load();
    };

    const handleEdit = async (c: Commander) => {
        await commanderService.updateCommander(c.id!, { ...c, bracket: editBracket });
        setEditingId(null);
        load();
    };

    const sel: React.CSSProperties = { padding: '0.4rem 0.6rem', borderRadius: '0.25rem', backgroundColor: '#111827', color: 'white', border: '1px solid #4b5563', outline: 'none', fontSize: '0.85rem' };

    return (
        <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Ma Collection</h2>
                <select onChange={e => setFilter(e.target.value || undefined)} style={sel}>
                    <option value="">Tous les Brackets</option>
                    {BRACKETS.map(b => <option key={b} value={b}>{BRACKET_LABELS[b]}</option>)}
                </select>
            </div>

            {commanders.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Aucun commandant trouvé.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {commanders.map(c => (
                        <div key={c.id}
                            style={{ position: 'relative', borderRadius: '0.4rem', overflow: 'hidden', border: `2px solid ${hoveredId === c.id ? '#eab308' : c.isActive ? '#374151' : '#7f1d1d'}`, transition: 'border-color 0.2s', opacity: c.isActive ? 1 : 0.5 }}
                            onMouseEnter={() => setHoveredId(c.id ?? null)}
                            onMouseLeave={() => { setHoveredId(null); }}>

                            <img src={c.imageUrl} alt={c.name} style={{ width: '100%', height: 'auto', display: 'block' }} />

                            {/* Badge bracket */}
                            <div style={{ position: 'absolute', top: '0.3rem', left: '0.3rem', backgroundColor: 'rgba(0,0,0,0.75)', color: '#fbbf24', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                                {BRACKET_LABELS[c.bracket] ?? c.bracket}
                            </div>

                            {/* Overlay hover */}
                            {hoveredId === c.id && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.92)', padding: '0.5rem 0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'white', textAlign: 'center', fontWeight: 'bold', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>

                                    {/* Edit bracket */}
                                    {editingId === c.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <select value={editBracket} onChange={e => setEditBracket(e.target.value)} style={{ ...sel, fontSize: '0.7rem', padding: '0.3rem' }}>
                                                {BRACKETS.map(b => <option key={b} value={b}>{BRACKET_LABELS[b]}</option>)}
                                            </select>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button onClick={() => handleEdit(c)} style={{ flex: 1, padding: '0.25rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>✓</button>
                                                <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '0.25rem', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                                            </div>
                                        </div>
                                    ) : confirmDeleteId === c.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <p style={{ color: '#f87171', fontSize: '0.65rem', textAlign: 'center', margin: 0 }}>Supprimer ?</p>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button onClick={() => handleDelete(c.id!)} style={{ flex: 1, padding: '0.25rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>Oui</button>
                                                <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '0.25rem', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>Non</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {/* Toggle actif */}
                                            <button onClick={() => handleToggle(c)} title={c.isActive ? 'Désactiver' : 'Activer'}
                                                style={{ flex: 1, padding: '0.3rem', backgroundColor: c.isActive ? '#78350f' : '#166534', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                                                {c.isActive ? '⏸' : '▶'}
                                            </button>
                                            {/* Edit */}
                                            <button onClick={() => { setEditingId(c.id!); setEditBracket(c.bracket); }} title="Modifier le bracket"
                                                style={{ flex: 1, padding: '0.3rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                                                ✏️
                                            </button>
                                            {/* Delete */}
                                            <button onClick={() => setConfirmDeleteId(c.id!)} title="Supprimer"
                                                style={{ flex: 1, padding: '0.3rem', backgroundColor: '#7f1d1d', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                                                🗑
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommanderList;
