import { useState } from 'react';
import { commanderService } from '../services/api';
import type { Commander } from '../types';

const Roulette = () => {
    const [winner, setWinner] = useState<Commander | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [bracket, setBracket] = useState(3);
    const [excludeCount, setExcludeCount] = useState(3);
    const [error, setError] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const startSpin = async () => {
        setIsSpinning(true);
        setWinner(null);
        setError('');
        setConfirmed(false);
        try {
            const data = await commanderService.getRoulettePool(bracket, excludeCount);
            if (data.length === 0) {
                setError(`Aucun commandant disponible dans le bracket ${bracket} avec ces paramètres.`);
                setIsSpinning(false);
                return;
            }
            setTimeout(() => {
                setWinner(data[Math.floor(Math.random() * data.length)]);
                setIsSpinning(false);
            }, 2000);
        } catch {
            setError('Erreur de connexion au serveur.');
            setIsSpinning(false);
        }
    };

    const confirmChoice = async () => {
        if (!winner?.id) return;
        setConfirming(true);
        try {
            await commanderService.recordPlay({ commanderId: winner.id, userId: 0 });
            setConfirmed(true);
        } catch {
            setError("Erreur lors de l'enregistrement.");
        } finally {
            setConfirming(false);
        }
    };

    const sel: React.CSSProperties = {
        padding: '0.4rem 0.6rem', borderRadius: '0.25rem',
        backgroundColor: '#111827', color: 'white',
        border: '1px solid #4b5563', outline: 'none', fontSize: '0.9rem',
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: '#1f2937', padding: '1.5rem 1rem',
            borderRadius: '0.75rem', border: '1px solid #374151',
        }}>
            <h2 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.875rem)', fontWeight: '900', color: '#eab308',
                marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                textAlign: 'center',
            }}>Générateur de Destin</h2>

            {/* Paramètres */}
            <div style={{
                display: 'flex', gap: '1rem', flexWrap: 'wrap',
                justifyContent: 'center', marginBottom: '0.75rem', width: '100%',
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label style={{ color: '#d1d5db', fontWeight: 'bold', fontSize: '0.85rem' }}>Bracket :</label>
                    <select value={bracket} onChange={e => setBracket(Number(e.target.value))} style={sel}>
                        {[1, 2, 3, 4, 5].map(b => <option key={b} value={b}>Bracket {b}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label style={{ color: '#d1d5db', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        Exclure les <span style={{ color: '#fbbf24' }}>{excludeCount}</span> derniers :
                    </label>
                    <input
                        type="range" min={0} max={10} value={excludeCount}
                        onChange={e => setExcludeCount(Number(e.target.value))}
                        style={{ width: '80px', accentColor: '#ca8a04' }}
                    />
                </div>
            </div>

            {excludeCount > 0 && (
                <p style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '1rem', textAlign: 'center' }}>
                    Les {excludeCount} commandants joués en dernier ne seront pas tirés.
                </p>
            )}

            {/* Zone carte — taille responsive */}
            <div style={{
                width: 'min(18rem, 80vw)',
                height: 'min(24rem, 55vw)',
                border: '4px solid #ca8a04', borderRadius: '0.75rem',
                overflow: 'hidden', display: 'flex', alignItems: 'center',
                justifyContent: 'center', backgroundColor: '#111827',
            }}>
                {isSpinning ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '3rem', display: 'inline-block', animation: 'spin 1s linear infinite' }}>🎲</span>
                        <p style={{ color: '#eab308', fontWeight: 'bold', animation: 'pulse 1s ease-in-out infinite', margin: 0 }}>
                            Tirage en cours...
                        </p>
                    </div>
                ) : winner ? (
                    <img src={winner.imageUrl} alt={winner.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Prêt à jouer ?</span>
                )}
            </div>

            {error && (
                <p style={{ color: '#f87171', marginTop: '1rem', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
                    {error}
                </p>
            )}

            {winner && !isSpinning && !confirmed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', width: '100%' }}>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0, textAlign: 'center' }}>
                        {winner.name} <span style={{ color: '#eab308' }}>(Bracket {winner.bracket})</span>
                    </p>
                    <button onClick={confirmChoice} disabled={confirming} style={{
                        padding: '0.75rem 2rem', backgroundColor: '#16a34a', color: 'white',
                        borderRadius: '9999px', fontWeight: '700', fontSize: '1rem',
                        border: 'none', cursor: confirming ? 'not-allowed' : 'pointer',
                        opacity: confirming ? 0.7 : 1,
                    }}>
                        {confirming ? 'Enregistrement...' : '✓ Jouer ce commandant'}
                    </button>
                    <button onClick={startSpin} style={{
                        padding: '0.5rem 1.5rem', backgroundColor: 'transparent', color: '#9ca3af',
                        borderRadius: '9999px', fontWeight: '600', fontSize: '0.9rem',
                        border: '1px solid #4b5563', cursor: 'pointer',
                    }}>
                        ↺ Pas celui-là — relancer
                    </button>
                </div>
            )}

            {confirmed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1rem', margin: 0, textAlign: 'center' }}>
                        ✓ Bonne partie avec {winner?.name} !
                    </p>
                    <button onClick={startSpin} style={{
                        padding: '0.9rem 2.5rem', backgroundColor: '#ca8a04', color: '#111827',
                        borderRadius: '9999px', fontWeight: '900', fontSize: '1.1rem',
                        border: 'none', cursor: 'pointer',
                    }}>
                        NOUVEAU TIRAGE
                    </button>
                </div>
            )}

            {!winner && !isSpinning && (
                <button onClick={startSpin} style={{
                    marginTop: '1.5rem', padding: '0.9rem 2.5rem', backgroundColor: '#ca8a04',
                    color: '#111827', borderRadius: '9999px', fontWeight: '900',
                    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                    border: 'none', cursor: 'pointer',
                }}>
                    LANCER LA ROUE
                </button>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default Roulette;
