import { useState, useEffect } from 'react';
import { commanderService } from '../services/api';
import { BRACKETS, BRACKET_LABELS } from '../utils/brackets';

const AddCommander = ({ onAdded }: { onAdded: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [bracket, setBracket] = useState('3Fa');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const search = async () => {
            if (searchTerm.length < 3) { setSearchResults([]); return; }
            setIsSearching(true);
            const results = await commanderService.searchScryfall(searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        };
        const t = setTimeout(search, 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCard) return;
        const imageUrl = selectedCard.image_uris?.normal || selectedCard.card_faces?.[0]?.image_uris?.normal || '';
        try {
            await commanderService.addCommander({
                userId: 0,
                name: selectedCard.name,
                scryfallId: selectedCard.id,
                imageUrl,
                bracket
            });
            setSearchTerm(''); setSelectedCard(null); onAdded();
        } catch (error: any) {
            alert("Erreur : " + error.message);
        }
    };

    const inp: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '0.25rem', backgroundColor: '#111827', border: '1px solid #4b5563', color: 'white', outline: 'none', boxSizing: 'border-box' };

    return (
        <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', margin: '0 0 1rem', color: 'white' }}>Ajouter un Commandant</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="Rechercher une carte (ex: Atraxa)..." value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setSelectedCard(null); }} style={inp} />
                    {isSearching && <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.8rem' }}>...</span>}
                </div>

                {searchResults.length > 0 && !selectedCard && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#111827', border: '1px solid #4b5563', borderRadius: '0.25rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {searchResults.map(card => (
                            <li key={card.id} onClick={() => setSelectedCard(card)}
                                style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid #374151', color: 'white', fontSize: '0.9rem' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#374151'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                {card.name}
                            </li>
                        ))}
                    </ul>
                )}

                {selectedCard && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <img src={selectedCard.image_uris?.normal || selectedCard.card_faces?.[0]?.image_uris?.normal}
                            alt={selectedCard.name} style={{ width: '140px', borderRadius: '0.5rem', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0, color: 'white' }}>{selectedCard.name}</p>
                            <select value={bracket} onChange={e => setBracket(e.target.value)}
                                style={{ padding: '0.6rem', borderRadius: '0.25rem', backgroundColor: '#111827', color: 'white', border: '1px solid #4b5563', outline: 'none' }}>
                                {BRACKETS.map(b => <option key={b} value={b}>{BRACKET_LABELS[b]}</option>)}
                            </select>
                            <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ca8a04', color: 'white', fontWeight: 'bold', borderRadius: '0.25rem', cursor: 'pointer', border: 'none' }}>
                                Ajouter à la collection
                            </button>
                            <button type="button" onClick={() => setSelectedCard(null)}
                                style={{ padding: '0.4rem', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                                ✕ Changer de carte
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddCommander;
