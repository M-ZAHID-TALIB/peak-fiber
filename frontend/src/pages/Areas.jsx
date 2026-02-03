import React, { useState, useEffect } from 'react';
import { MapPin, Plus, MoreVertical, Globe, Users, Wifi, Activity, ShieldCheck, Server } from 'lucide-react';
import Modal from '../components/Modal';

const Areas = () => {
    const [areas, setAreas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAreas = () => {
        setLoading(true);
        fetch('http://localhost:8000/api/areas')
            .then(res => res.json())
            .then(data => {
                setAreas(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/areas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
            if (response.ok) {
                setIsModalOpen(false);
                setNewName('');
                fetchAreas();
            }
        } catch (err) { console.error(err); }
    };

    // Simulated stats calculation
    const totalZones = areas.length;
    const coveredPopulation = areas.length * 150; // Mock stat for UI
    const activeNodes = areas.length * 4; // Mock stat for UI

    return (
        <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Network Topology</h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', lineHeight: '1.5' }}>
                            Manage your fiber distribution zones and coverage areas. Monitor operational status and expansion sectors.
                        </p>
                    </div>
                    <button
                        className="login-btn"
                        style={{
                            width: 'auto',
                            padding: '1rem 2rem',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 25px -5px rgba(13, 35, 92, 0.25)',
                            background: 'linear-gradient(135deg, #0d235c 0%, #1e3a8a 100%)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '8px' }}>
                            <Plus size={18} color="white" />
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Add Territory</span>
                    </button>
                </div>

                {/* KPI Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '2rem' }}>
                    {[
                        { label: 'Active Zones', value: totalZones, icon: Globe, color: '#3b82f6', bg: '#eff6ff' },
                        { label: 'Covered Households', value: `~${coveredPopulation}+`, icon: Users, color: '#059669', bg: '#ecfdf5' },
                        { label: 'Distribution Nodes', value: activeNodes, icon: Server, color: '#8b5cf6', bg: '#f5f3ff' },
                        { label: 'Network Health', value: '98.5%', icon: Activity, color: '#f59e0b', bg: '#fffbeb' },
                    ].map((stat, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{ background: stat.bg, padding: '10px', borderRadius: '12px' }}>
                                    <stat.icon size={22} color={stat.color} />
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: stat.color, background: stat.bg, padding: '4px 8px', borderRadius: '20px' }}>
                                    Live
                                </div>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Areas Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading network data...</div>
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Deployed Sectors</h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Showing {areas.length} territories</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        {areas.map((area, index) => (
                            <div key={area.id} style={{
                                background: 'white',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #f1f5f9',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}>
                                {/* Card Header with Pattern */}
                                <div style={{
                                    height: '100px',
                                    background: `linear-gradient(120deg, ${['#eff6ff', '#f0fdf4', '#f5f3ff', '#fff7ed'][index % 4]} 0%, white 100%)`,
                                    padding: '24px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        background: 'white',
                                        padding: '12px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                    }}>
                                        <MapPin size={24} color="#0d235c" />
                                    </div>
                                    <button style={{
                                        background: 'rgba(255,255,255,0.5)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        color: '#64748b'
                                    }}>
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '0 24px 24px 24px' }}>
                                    <div style={{ marginTop: '-10px' }}>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 5px 0' }}>{area.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                                            <ShieldCheck size={14} color="#059669" /> All Services Operational
                                        </div>
                                    </div>

                                    {/* Mini Dashboard inside card */}
                                    <div style={{
                                        marginTop: '20px',
                                        background: '#f8fafc',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Latency</div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>~4ms</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Uptime</div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#059669' }}>99.9%</div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2', height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Wifi size={14} color="#3b82f6" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Fiber-to-Home</span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', background: '#e0effe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>ACTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* MODERN CREATE MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Territory Deployment">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #0ea5e9' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '1rem' }}>Sector Expansion</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                            You are about to define a new operational zone. This will create a new tracking entity for inventory and user assignments.
                        </p>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>Zone Designation / Name</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Phase 7 Extension, North Block"
                                required
                                style={{
                                    padding: '1.2rem 1.2rem 1.2rem 3.5rem',
                                    borderRadius: '16px',
                                    border: '2px solid #e2e8f0',
                                    width: '100%',
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0d235c'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: '#e2e8f0', padding: '6px', borderRadius: '8px' }}>
                                <MapPin size={20} color="#64748b" />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc' }}>
                            <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Standard Coverage</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Residential FTTH</div>
                        </div>
                        <div style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', opacity: 0.6 }}>
                            <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Commercial Zone</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Business Dedicated</div>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        fontWeight: '800',
                        fontSize: '1.1rem',
                        background: '#0d235c',
                        marginTop: '10px',
                        boxShadow: '0 10px 25px -5px rgba(13, 35, 92, 0.4)'
                    }}>
                        Deploy New Zone
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Areas;
