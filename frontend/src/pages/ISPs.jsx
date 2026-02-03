import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Globe, Activity, Server, Signal, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import Modal from '../components/Modal';

const ISPs = () => {
    const [isps, setIsps] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', image_url: '' });

    const fetchISPs = () => {
        fetch('http://localhost:8000/api/isps')
            .then(res => res.json())
            .then(data => setIsps(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchISPs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/isps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', image_url: '' });
                fetchISPs();
            }
        } catch (err) { console.error(err); }
    };

    const filteredISPs = isps.filter(isp =>
        isp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c', margin: 0 }}>Upstream Providers (ISPs)</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Manage internet bandwidth sources and carrier links</p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search Provider..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '220px' }}
                        />
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                    <button
                        className="login-btn"
                        style={{ width: 'auto', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(13, 35, 92, 0.15)' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusCircle size={20} />
                        Add New Link
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {filteredISPs.map((isp) => (
                    <div key={isp.id} style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #f1f5f9',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.04)';
                        }}
                    >
                        {/* Header with Logo */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0'
                            }}>
                                {isp.image_url ? (
                                    <img
                                        src={isp.image_url.startsWith('http') ? isp.image_url : `http://localhost:8000${isp.image_url}`}
                                        alt={isp.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150?text=' + isp.name.charAt(0);
                                        }}
                                    />
                                ) : (
                                    <Globe size={32} color="#0d235c" />
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{
                                    background: '#ecfdf5',
                                    color: '#059669',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></div>
                                    ONLINE
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Uptime: 99.9%</div>
                            </div>
                        </div>

                        {/* Name and Stats */}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0d235c', margin: '0 0 1rem 0' }}>{isp.name}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Activity size={12} /> Latency
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>4ms</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Server size={12} /> Capacity
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>10 Gbps</div>
                            </div>
                        </div>

                        {/* Load Bar (Mock) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: '#64748b' }}>
                                <span>Current Bandwidth Usage</span>
                                <span style={{ fontWeight: '600', color: '#3b82f6' }}>{Math.floor(Math.random() * 40) + 40}% Load</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.floor(Math.random() * 40) + 40}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Phone size={14} /> Contact NOC
                            </button>
                            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#eff6ff', color: '#1d4ed8', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <ArrowUpRight size={14} /> Dashboard
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Integrate New Provider"
            >
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Provider / Carrier Name</label>
                        <div style={{ position: 'relative', marginTop: '8px' }}>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Cybernet, Nayatel"
                                required
                                style={{ padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', fontSize: '1rem' }}
                            />
                            <Globe size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Logo URL / Path</label>
                        <div style={{ position: 'relative', marginTop: '8px' }}>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="e.g. /logos/cybernet.png"
                                style={{ padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', fontSize: '1rem' }}
                            />
                            <AlertCircle size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                            Place logo files in the <b>/public</b> folder for easy access.
                        </p>
                    </div>

                    <button type="submit" className="login-btn" style={{ padding: '1.2rem', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', background: '#0d235c' }}>Establish Link</button>
                </form>
            </Modal>
        </div>
    );
};

export default ISPs;
