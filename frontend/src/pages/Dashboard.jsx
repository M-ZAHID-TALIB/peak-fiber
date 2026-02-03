
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wifi, Users, Package, UserCheck, MapPin, ListChecks, DollarSign,
    Landmark, CreditCard, Heart, Ticket, Bot, MessageSquare,
    ArrowUpRight, Wallet, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ total_receivable: 0, in_hand_cash: 0, missing_amount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/dashboard/summary')
            .then(res => res.json())
            .then(data => {
                setSummary(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const menuItems = [
        { name: 'Connections', icon: Wifi, path: '/connections', color: '#3b82f6', bg: '#eff6ff' },
        { name: 'ISPs', icon: Users, path: '/isps', color: '#8b5cf6', bg: '#f5f3ff' },
        { name: 'Inventory', icon: Package, path: '/inventory', color: '#10b981', bg: '#ecfdf5' },
        { name: 'Staff', icon: UserCheck, path: '/staff', color: '#f59e0b', bg: '#fffbeb' },
        { name: 'Areas', icon: MapPin, path: '/areas', color: '#ec4899', bg: '#fdf2f8' },
        { name: 'Action Queue', icon: ListChecks, path: '/queue', color: '#ef4444', bg: '#fef2f2' },
        { name: 'Expenses', icon: DollarSign, path: '/expenses', color: '#6366f1', bg: '#e0e7ff' },
        { name: 'Banks', icon: Landmark, path: '/banks', color: '#06b6d4', bg: '#cffafe' },
        { name: 'Deposits', icon: CreditCard, path: '/deposits', color: '#14b8a6', bg: '#ccfbf1' },
        { name: 'Promises', icon: Heart, path: '/promises', color: '#f43f5e', bg: '#ffe4e6' },
        { name: 'Vouchers', icon: Ticket, path: '/vouchers', color: '#d946ef', bg: '#fae8ff' },
        { name: 'SMS Bots', icon: Bot, path: '/sms-bots', color: '#8b5cf6', bg: '#ede9fe' },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints', color: '#f97316', bg: '#ffedd5' },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

            {/* Header / Welcome */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Overview of your network operations</p>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0d235c', background: '#e2e8f0', padding: '8px 16px', borderRadius: '20px' }}>
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* Premium Financial Card */}
            <div style={{
                background: 'linear-gradient(120deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '24px',
                padding: '2.5rem',
                color: 'white',
                marginBottom: '2.5rem',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03))', transform: 'skewX(-20deg)' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', position: 'relative', zIndex: 1 }}>
                    {/* Total Receivable */}
                    <div style={{ paddingRight: '20px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.7 }}>
                            <Wallet size={16} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Total Receivables</span>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                            PKR {summary.total_receivable.toLocaleString()}
                        </div>
                    </div>

                    {/* Cash In Hand */}
                    <div style={{ paddingRight: '20px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.7 }}>
                            <DollarSign size={16} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cash In-Hand</span>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#4ade80' }}>
                            PKR {summary.in_hand_cash.toLocaleString()}
                        </div>
                    </div>

                    {/* Uncollected */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.7 }}>
                            <AlertCircle size={16} color="#fbbf24" />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Unreconciled / Missing</span>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fbbf24' }}>
                            PKR {summary.missing_amount.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>Management Modules</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #f1f5f9', // Very subtle border
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)';
                        }}
                    >
                        {/* Icon Box */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: item.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: item.color,
                            flexShrink: 0
                        }}>
                            <item.icon size={26} strokeWidth={2} />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>{item.name}</h4>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Access Module <ArrowUpRight size={14} />
                            </div>
                        </div>

                        {/* Subtle Background decoration */}
                        <div style={{
                            position: 'absolute',
                            right: '-10px',
                            bottom: '-10px',
                            opacity: 0.03,
                            color: '#1e293b'
                        }}>
                            <item.icon size={80} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

