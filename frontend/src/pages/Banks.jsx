import React, { useState, useEffect } from 'react';
import { Landmark, Plus, MapPin, CreditCard, ChevronRight, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';

const Banks = () => {
    const [banks, setBanks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        account_title: '',
        account_number: '',
        branch_name: '',
        opening_balance: 0
    });

    const fetchBanks = () => {
        fetch('http://localhost:8000/api/banks')
            .then(res => res.json())
            .then(data => setBanks(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/banks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', location: '', account_title: '', account_number: '', branch_name: '', opening_balance: 0 });
                fetchBanks();
            }
        } catch (err) { console.error(err); }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Treasury & Banks</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Manage corporate bank accounts, liquidity, and fund flow.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: '#0d235c',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(13, 35, 92, 0.2)'
                    }}
                >
                    <Plus size={20} /> Add Bank Account
                </button>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {banks.map((bank) => (
                    <div key={bank.id} style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '24px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Landmark size={32} color="#0d235c" />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    background: bank.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                                    color: bank.status === 'Active' ? '#166534' : '#991b1b',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700'
                                }}>
                                    {bank.status || 'ACTIVE'}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{bank.name}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{bank.branch_name}</p>
                        </div>

                        <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>Available Balance</p>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c' }}>
                                {formatCurrency(bank.current_balance)}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>ACCOUNT NO</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#334155' }}>{bank.account_number}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>ACCOUNT TITLE</span>
                                <span style={{ color: '#334155', fontWeight: '500' }}>{bank.account_title}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {banks.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}><Landmark size={48} /></div>
                        <h4 style={{ margin: 0, color: '#64748b' }}>No bank accounts registered</h4>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '8px' }}>Add your first corporate account to start tracking liquidity.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Bank Account">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Bank Name</label>
                            <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. HBL" required />
                        </div>
                        <div>
                            <label style={labelStyle}>Branch Name</label>
                            <input type="text" style={inputStyle} value={formData.branch_name} onChange={e => setFormData({ ...formData, branch_name: e.target.value })} placeholder="e.g. Liberty Branch" required />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Account Title</label>
                        <input type="text" style={inputStyle} value={formData.account_title} onChange={e => setFormData({ ...formData, account_title: e.target.value })} placeholder="e.g. Peak Fiber Pvt Ltd" required />
                    </div>

                    <div>
                        <label style={labelStyle}>Account / IBAN Number</label>
                        <input type="text" style={inputStyle} value={formData.account_number} onChange={e => setFormData({ ...formData, account_number: e.target.value })} placeholder="PK36 HABB..." required />
                    </div>

                    <div>
                        <label style={labelStyle}>Opening Balance (PKR)</label>
                        <input type="number" style={inputStyle} value={formData.opening_balance} onChange={e => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) })} required />
                    </div>

                    <button type="submit" style={{ ...inputStyle, background: '#0d235c', color: 'white', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Register Account</button>
                </form>
            </Modal>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' };

export default Banks;
