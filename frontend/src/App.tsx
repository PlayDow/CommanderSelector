import { useState } from 'react';
import { authService } from './services/api';
import Login from './components/Login';
import AddCommander from './components/AddCommander';
import CommanderList from './components/CommanderList';
import Roulette from './components/Roulette';
import History from './components/History';
import Stats from './components/Stats';
import Community from './components/Community';
import Admin from './components/Admin';

type Tab = 'roulette' | 'collection' | 'history' | 'stats' | 'community' | 'admin';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => authService.isLoggedIn());
    const [activeTab, setActiveTab] = useState<Tab>('roulette');
    const [refreshKey, setRefreshKey] = useState(0);

    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

    const isAdmin = authService.isAdmin();

    const tabStyle = (tab: Tab): React.CSSProperties => ({
        padding: '0.4rem 0.9rem', borderRadius: '0.25rem', fontWeight: 'bold',
        textTransform: 'uppercase', fontSize: '0.78rem', cursor: 'pointer',
        border: '1px solid #374151', whiteSpace: 'nowrap',
        backgroundColor: activeTab === tab ? '#ca8a04' : 'transparent',
        color: activeTab === tab ? '#111827' : '#9ca3af',
        transition: 'all 0.2s',
    });

    return (
        <>
            <style>{`html,body,#root{margin:0;padding:0;min-height:100vh;background-color:#030712;}*{box-sizing:border-box;}`}</style>
            <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: 'white' }}>

                {/* Navbar */}
                <nav style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '0.6rem 1rem', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: '#eab308', fontWeight: '900', fontSize: '1rem', marginRight: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        MTG Selector
                    </span>

                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', flex: 1 }}>
                        <button style={tabStyle('roulette')} onClick={() => setActiveTab('roulette')}>🎲 Roulette</button>
                        <button style={tabStyle('collection')} onClick={() => setActiveTab('collection')}>📚 Collection</button>
                        <button style={tabStyle('history')} onClick={() => setActiveTab('history')}>📜 Historique</button>
                        <button style={tabStyle('stats')} onClick={() => setActiveTab('stats')}>📊 Stats</button>
                        <button style={tabStyle('community')} onClick={() => setActiveTab('community')}>🌍 Communauté</button>
                        {isAdmin && <button style={tabStyle('admin')} onClick={() => setActiveTab('admin')}>⚙️ Admin</button>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                        <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            {authService.getUsername()}
                            {isAdmin && <span style={{ color: '#ca8a04', marginLeft: '0.3rem', fontSize: '0.7rem' }}>★ Admin</span>}
                        </span>
                        <button onClick={() => { authService.logout(); setIsLoggedIn(false); }} style={{ padding: '0.35rem 0.75rem', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Déconnexion
                        </button>
                    </div>
                </nav>

                {/* Contenu */}
                <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
                    {activeTab === 'roulette' && <Roulette />}
                    {activeTab === 'collection' && (
                        <>
                            <AddCommander onAdded={() => setRefreshKey(k => k + 1)} />
                            <CommanderList refreshKey={refreshKey} />
                        </>
                    )}
                    {activeTab === 'history' && <History />}
                    {activeTab === 'stats' && <Stats />}
                    {activeTab === 'community' && <Community />}
                    {activeTab === 'admin' && isAdmin && <Admin />}
                </main>
            </div>
        </>
    );
}

export default App;
