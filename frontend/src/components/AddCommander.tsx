import { useState, useEffect } from 'react';
import { commanderService } from '../services/api';

const AddCommander = ({ onAdded }: { onAdded: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [bracket, setBracket] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const search = async () => {
            if (searchTerm.length < 3) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const results = await commanderService.searchScryfall(searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        };

        const delayDebounceFn = setTimeout(() => search(), 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCard) return;

        const imageUrl = selectedCard.image_uris?.normal || selectedCard.card_faces?.[0]?.image_uris?.normal || '';

        try {
            await commanderService.addCommander({
                userId: 1, // Temporaire
                name: selectedCard.name,
                scryfallId: selectedCard.id,
                imageUrl: imageUrl,
                bracket: bracket
            });
            setSearchTerm('');
            setSelectedCard(null);
            onAdded();
        } catch (error) {
            console.error("Erreur d'ajout", error);
            alert("Erreur lors de l'enregistrement ! (Regarde la console)");
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8" style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', color: 'white' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ajouter un Commandant</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Rechercher une carte (ex: Atraxa)..." 
                        value={searchTerm} 
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setSelectedCard(null); 
                        }} 
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', backgroundColor: '#111827', border: '1px solid #4b5563', color: 'white' }}
                    />
                    {isSearching && <span style={{ marginLeft: '10px', color: '#9ca3af' }}>Recherche...</span>}
                </div>

                {/* Liste soft (sans grosses images) */}
                {searchResults.length > 0 && !selectedCard && (
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, backgroundColor: '#111827', border: '1px solid #4b5563', borderRadius: '0.25rem' }}>
                        {searchResults.map(card => (
                            <li 
                                key={card.id} 
                                onClick={() => setSelectedCard(card)}
                                style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #374151' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {card.name}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Carte complète sélectionnée */}
                {selectedCard && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '1rem' }}>
                        <img 
                            src={selectedCard.image_uris?.normal || selectedCard.card_faces?.[0]?.image_uris?.normal} 
                            alt={selectedCard.name} 
                            style={{ width: '200px', borderRadius: '0.5rem' }} 
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedCard.name}</p>
                            
                            <select 
                                value={bracket} 
                                onChange={e => setBracket(Number(e.target.value))} 
                                style={{ padding: '0.75rem', borderRadius: '0.25rem', backgroundColor: '#1f2937', color: 'white' }}
                            >
                                {[1, 2, 3, 4, 5].map(b => <option key={b} value={b}>Bracket {b}</option>)}
                            </select>

                            <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ca8a04', color: 'white', fontWeight: 'bold', borderRadius: '0.25rem', cursor: 'pointer', border: 'none' }}>
                                Ajouter à la collection
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddCommander;