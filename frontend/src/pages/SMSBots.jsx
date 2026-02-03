import React, { useState, useEffect } from 'react';
import { Copy, Plus, Bot, Activity, Wifi, Power, RefreshCw, Send, Terminal, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';

const SMSBots = () => {
    const [bots, setBots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const [logs, setLogs] = useState([
        { time: '10:42 AM', msg: 'System initialized.' },
        { time: '10:45 AM', msg: 'Bot #1 [Alpha] handshake successful.' },
        { time: '11:00 AM', msg: 'Scheduled broadcast: "Payment Reminder" queued.' }
    ]);
    const [loading, setLoading] = useState(false);

    const fetchBots = () => {
        fetch('http://localhost:8000/api/sms-bots')
            .then(res => res.json())
            .then(data => setBots(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBots();
        // Mock live logs
        const interval = setInterval(() => {
            const msgs = [
                'Heartbeat check...',
                'Gateway response: 200 OK',
                'Queue processing: 0 pending',
                'Syncing delivery reports...'
            ];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            setLogs(prev => [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: randomMsg }, ...prev.slice(0, 4)]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/sms-bots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    created_at: new Date().toLocaleDateString('en-GB')
                })
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', username: '', password: '' });
                fetchBots();
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c', margin: 0 }}>Communication Grid</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Manage automated SMS gateways and broadcast alerts</p>
                </div>

                <button
                    className="login-btn"
                    style={{ width: 'auto', padding: '0.8rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(13, 35, 92, 0.15)' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} /> Deploy New Bot
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Left Column: Bots List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', alignContent: 'start' }}>
                    {bots.map((bot) => (
                        <div key={bot.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Bot size={24} color="#0d235c" />
                                </div>
                                <div style={{
                                    background: bot.status === 'Online' ? '#ecfdf5' : '#fef2f2',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bot.status === 'Online' ? '#059669' : '#dc2626' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: bot.status === 'Online' ? '#059669' : '#dc2626' }}>{bot.status === 'Online' ? 'OPERATIONAL' : 'OFFLINE'}</span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>{bot.name}</h3>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                                <Wifi size={14} /> Gateway: {bot.username}
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Throughput</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0d235c' }}>{bot.slots} / 10 TPS</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Last Active</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>{bot.last_sent || 'Idle'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <RefreshCw size={14} /> Sync
                                </button>
                                <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#0d235c', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <Send size={14} /> Test
                                </button>
                            </div>
                        </div>
                    ))}

                    {bots.length === 0 && (
                        <div style={{ gridColumn: 'span 2', padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px dashed #e2e8f0' }}>
                            <Bot size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: '#94a3b8' }}>No active gateways found.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Console/Logs */}
                <div>
                    <div style={{ background: '#1e293b', borderRadius: '20px', padding: '1.5rem', color: '#f8fafc', minHeight: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <Terminal size={20} color="#4ade80" />
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#f8fafc' }}>Live System Log</h3>
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {logs.map((log, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', opacity: index === 0 ? 1 : 0.6 }}>
                                    <span style={{ color: '#64748b' }}>[{log.time}]</span>
                                    <span style={{ color: '#e2e8f0' }}>{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize SMS Gateway">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Bot Identifier (Name)</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Alpha OTP Node" required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>API Username</label>
                            <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>API Token / Password</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', fontSize: '0.8rem', color: '#166534', display: 'flex', gap: '10px' }}>
                        <CheckCircle2 size={18} color="#15803d" />
                        <span>System will automatically attempt a handshake upon registration to verify credentials.</span>
                    </div>

                    <button type="submit" className="login-btn" style={{ padding: '1.2rem', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', background: '#0d235c' }} disabled={loading}>
                        {loading ? 'Verifying...' : 'Establish Connection'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default SMSBots;
