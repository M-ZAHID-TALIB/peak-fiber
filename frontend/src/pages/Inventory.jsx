import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Router, Layers, Box, Zap, Share2, Clipboard, TrendingUp, Cpu, Tv, Package, Search } from 'lucide-react';

const Inventory = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({});

    const inventoryItems = [
        { name: 'ROUTER', icon: Router, color: '#4f46e5' },
        { name: 'SWITCH', icon: Layers, color: '#0d235c' },
        { name: 'BOX', icon: Box, color: '#059669' },
        { name: 'FIBER_OPTIC', icon: Zap, color: '#f59e0b' },
        { name: 'DUCT_PATTI', icon: Share2, color: '#7c3aed' },
        { name: 'ODF', icon: Clipboard, color: '#db2777' },
        { name: 'CAT6', icon: Box, color: '#2563eb' },
        { name: 'PATCH_CORD', icon: Cpu, color: '#0891b2' },
        { name: 'CATV_DEVICE', icon: Tv, color: '#4b5563' },
    ];

    useEffect(() => {
        fetch('http://localhost:8000/api/inventory/summary')
            .then(res => res.json())
            .then(data => setCounts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c', margin: 0 }}>Warehouse Inventory</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Manage and track your technical assets and hardware</p>
                </div>
                <div style={{ background: '#eff6ff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase' }}>System Status</div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0d235c' }}>Live Asset Tracking</div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {inventoryItems.map((item, index) => {
                    const count = counts[item.name] || 0;
                    return (
                        <div key={index} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2.5rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            textAlign: 'center',
                            border: '1px solid #f1f5f9',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                            onClick={() => navigate(`/inventory/${item.name.toLowerCase()}`)}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = item.color + '44';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.04)';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                            }}
                        >
                            {/* Decorative background element */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '80px',
                                height: '80px',
                                background: item.color,
                                opacity: 0.03,
                                borderRadius: '50%'
                            }} />

                            <div style={{
                                marginBottom: '1.5rem',
                                color: item.color,
                                background: item.color + '11',
                                padding: '1.5rem',
                                borderRadius: '24px'
                            }}>
                                <item.icon size={48} strokeWidth={1.5} />
                            </div>

                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                marginBottom: '8px'
                            }}>
                                {item.name.replace('_', ' ')}
                            </div>

                            <div style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: count > 0 ? '#059669' : '#94a3b8',
                                background: count > 0 ? '#ecfdf5' : '#f1f5f9',
                                padding: '4px 12px',
                                borderRadius: '20px'
                            }}>
                                {count} Items in Stock
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Inventory;
