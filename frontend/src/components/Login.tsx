import { useState } from 'react';
import { authService } from '../services/api';

type Mode = 'login' | 'register' | 'recover';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registeredCode, setRegisteredCode] = useState('');
    const [newRecoveryCode, setNewRecoveryCode] = useState('');

    const reset = () => {
        setError(''); setRegisteredCode(''); setNewRecoveryCode('');
        setUsername(''); setPassword(''); setNewPassword(''); setRecoveryCode('');
    };
    const switchMode = (m: Mode) => { reset(); setMode(m); };

    const handleLogin = async () => {
        if (!username || !password) { setError('Remplis tous les champs.'); return; }
        setLoading(true); setError('');
        try { await authService.login(username, password); onLogin(); }
        catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const handleRegister = async () => {
        if (!username || !password) { setError('Remplis tous les champs.'); return; }
        if (password.length < 6) { setError('Mot de passe trop court (6 car. min).'); return; }
        setLoading(true); setError('');
        try { const code = await authService.register(username, password); setRegisteredCode(code); }
        catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const handleRecover = async () => {
        if (!username || !recoveryCode || !newPassword) { setError('Remplis tous les champs.'); return; }
        setLoading(true); setError('');
        try { const code = await authService.recover(username, recoveryCode, newPassword); setNewRecoveryCode(code); }
        catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const inp: React.CSSProperties = {
        width: '100%', padding: '0.75rem', borderRadius: '0.25rem',
        backgroundColor: '#1f2937', border: '1px solid #374151',
        color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '1rem',
    };
    const btn: React.CSSProperties = {
        width: '100%', backgroundColor: '#ca8a04', color: '#111827',
        padding: '0.75rem', borderRadius: '0.25rem', fontWeight: 'bold',
        textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontSize: '1rem',
    };
    const tabBtn = (m: Mode): React.CSSProperties => ({
        flex: 1, padding: '0.6rem 0.25rem', border: 'none', cursor: 'pointer',
        fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase',
        backgroundColor: mode === m ? '#ca8a04' : 'transparent',
        color: mode === m ? '#111827' : '#9ca3af',
        borderBottom: mode === m ? 'none' : '1px solid #374151',
        transition: 'all 0.2s',
    });
    const codeBox: React.CSSProperties = {
        backgroundColor: '#1f2937', border: '1px solid #ca8a04',
        borderRadius: '0.5rem', padding: '1rem', textAlign: 'center',
    };

    return (
        <>
            <style>{`
                html, body, #root { margin: 0; padding: 0; min-height: 100vh; background-color: #030712; }
                * { box-sizing: border-box; }
            `}</style>
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '100vh',
                backgroundColor: '#030712', padding: '1rem',
            }}>
                <div style={{
                    backgroundColor: '#111827', borderRadius: '1rem',
                    width: '100%', maxWidth: '22rem',
                    border: '1px solid #1f2937', overflow: 'hidden',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}>
                    <div style={{ padding: '1.75rem 1.5rem 1rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: '900', color: '#eab308',
                            textTransform: 'uppercase', letterSpacing: '-0.05em', margin: 0,
                        }}>MTG Selector</h1>
                    </div>

                    <div style={{ display: 'flex' }}>
                        <button style={tabBtn('login')} onClick={() => switchMode('login')}>Connexion</button>
                        <button style={tabBtn('register')} onClick={() => switchMode('register')}>Inscription</button>
                        <button style={tabBtn('recover')} onClick={() => switchMode('recover')}>Récup.</button>
                    </div>

                    <div style={{ padding: '1.25rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                        {mode === 'login' && (<>
                            <input style={inp} type="text" placeholder="Pseudo"
                                value={username} onChange={e => setUsername(e.target.value)} />
                            <input style={inp} type="password" placeholder="Mot de passe"
                                value={password} onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                            <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </>)}

                        {mode === 'register' && !registeredCode && (<>
                            <input style={inp} type="text" placeholder="Pseudo"
                                value={username} onChange={e => setUsername(e.target.value)} />
                            <input style={inp} type="password" placeholder="Mot de passe (6 car. min)"
                                value={password} onChange={e => setPassword(e.target.value)} />
                            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                            <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
                                {loading ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </>)}

                        {mode === 'register' && registeredCode && (<>
                            <p style={{ color: '#4ade80', fontWeight: 'bold', margin: 0 }}>✓ Compte créé !</p>
                            <div style={codeBox}>
                                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                                    ⚠️ Note ce code — il ne sera plus affiché
                                </p>
                                <p style={{
                                    color: '#fbbf24', fontFamily: 'monospace',
                                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                                    fontWeight: 'bold', letterSpacing: '0.2em', margin: '0 0 0.5rem',
                                }}>{registeredCode}</p>
                                <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>
                                    Indispensable pour récupérer ton compte.
                                </p>
                            </div>
                            <button style={btn} onClick={() => { reset(); setMode('login'); }}>
                                J'ai noté → Se connecter
                            </button>
                        </>)}

                        {mode === 'recover' && !newRecoveryCode && (<>
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                                Entre ton pseudo, le code de récupération et ton nouveau mot de passe.
                            </p>
                            <input style={inp} type="text" placeholder="Pseudo"
                                value={username} onChange={e => setUsername(e.target.value)} />
                            <input style={{ ...inp, fontFamily: 'monospace', letterSpacing: '0.1em' }}
                                type="text" placeholder="Code de récupération"
                                value={recoveryCode} onChange={e => setRecoveryCode(e.target.value.toUpperCase())} />
                            <input style={inp} type="password" placeholder="Nouveau mot de passe"
                                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                            <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} onClick={handleRecover} disabled={loading}>
                                {loading ? 'Vérification...' : 'Réinitialiser'}
                            </button>
                        </>)}

                        {mode === 'recover' && newRecoveryCode && (<>
                            <p style={{ color: '#4ade80', fontWeight: 'bold', margin: 0 }}>✓ Mot de passe réinitialisé !</p>
                            <div style={codeBox}>
                                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                                    ⚠️ Ton nouveau code de récupération :
                                </p>
                                <p style={{
                                    color: '#fbbf24', fontFamily: 'monospace',
                                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                                    fontWeight: 'bold', letterSpacing: '0.2em', margin: 0,
                                }}>{newRecoveryCode}</p>
                            </div>
                            <button style={btn} onClick={() => { reset(); setMode('login'); }}>
                                J'ai noté → Se connecter
                            </button>
                        </>)}

                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
