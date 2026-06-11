import { useEffect, useState } from 'react';
import { adminService } from '../services/api';

interface Tag { id: number; name: string; }
interface UserSummary { id: number; userName: string; isAdmin: boolean; tags: Tag[]; }

const Admin = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            const [u, t] = await Promise.all([adminService.getUsers(), adminService.getTags()]);
            setUsers(u); setTags(t);
        } catch { setError('Impossible de charger les données.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const toggleAdmin = async (user: UserSummary) => {
        await adminService.setAdmin(user.id, !user.isAdmin);
        setUsers(u => u.map(x => x.id === user.id ? { ...x, isAdmin: !x.isAdmin } : x));
    };

    const toggleTag = async (user: UserSummary, tag: Tag) => {
        const hasTag = user.tags.some(t => t.id === tag.id);
        if (hasTag) {
            await adminService.removeTag(user.id, tag.id);
            setUsers(u => u.map(x => x.id === user.id ? { ...x, tags: x.tags.filter(t => t.id !== tag.id) } : x));
        } else {
            await adminService.assignTag(user.id, tag.id);
            setUsers(u => u.map(x => x.id === user.id ? { ...x, tags: [...x.tags, tag] } : x));
        }
    };

    const createTag = async () => {
        if (!newTagName.trim()) return;
        setSaving(true);
        try {
            await adminService.createTag(newTagName.trim().toUpperCase());
            setNewTagName('');
            await load();
        } catch { setError('Erreur création tag.'); }
        finally { setSaving(false); }
    };

    const deleteTag = async (tagId: number) => {
        if (!confirm('Supprimer ce tag ? Tous les utilisateurs le perdront.')) return;
        await adminService.deleteTag(tagId);
        await load();
    };

    const inp: React.CSSProperties = { padding: '0.5rem 0.75rem', borderRadius: '0.25rem', backgroundColor: '#111827', border: '1px solid #374151', color: 'white', outline: 'none', fontSize: '0.9rem' };
    const tagChip = (active: boolean): React.CSSProperties => ({
        padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold',
        cursor: 'pointer', border: 'none',
        backgroundColor: active ? '#1d4ed8' : '#374151',
        color: active ? 'white' : '#9ca3af',
        transition: 'all 0.15s',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Gestion des tags */}
            <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 1rem' }}>Tags</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {tags.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#1d4ed8', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {t.name}
                            <button onClick={() => deleteTag(t.id)} style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0 0 0.25rem', lineHeight: 1 }}>✕</button>
                        </div>
                    ))}
                    {tags.length === 0 && <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Aucun tag.</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input style={inp} type="text" placeholder="Nouveau tag (ex: IRW)" value={newTagName}
                        onChange={e => setNewTagName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && createTag()} />
                    <button onClick={createTag} disabled={saving || !newTagName.trim()} style={{ padding: '0.5rem 1rem', backgroundColor: '#ca8a04', color: '#111827', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                        Créer
                    </button>
                </div>
            </div>

            {/* Gestion des utilisateurs */}
            <div style={{ backgroundColor: '#1f2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem' }}>Utilisateurs</h2>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0 0 1rem' }}>Clique sur un tag pour l'assigner/retirer. Clique sur Admin pour changer le statut.</p>

                {loading && <p style={{ color: '#9ca3af', textAlign: 'center' }}>Chargement...</p>}
                {error && <p style={{ color: '#f87171' }}>{error}</p>}

                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {users.map(user => (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#111827', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', border: '1px solid #374151', flexWrap: 'wrap' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', minWidth: '120px' }}>
                                    {user.userName}
                                    <span style={{ color: '#4b5563', fontSize: '0.75rem', marginLeft: '0.4rem' }}>#{user.id}</span>
                                </span>

                                {/* Tags cliquables */}
                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', flex: 1 }}>
                                    {tags.map(tag => (
                                        <button key={tag.id} onClick={() => toggleTag(user, tag)}
                                            style={tagChip(user.tags.some(t => t.id === tag.id))}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Toggle admin */}
                                <button onClick={() => toggleAdmin(user)} style={{
                                    padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.75rem',
                                    border: 'none', cursor: 'pointer', flexShrink: 0,
                                    backgroundColor: user.isAdmin ? '#ca8a04' : '#374151',
                                    color: user.isAdmin ? '#111827' : '#9ca3af',
                                }}>
                                    {user.isAdmin ? '★ Admin' : 'User'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
