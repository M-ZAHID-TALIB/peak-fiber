import React, { useState, useEffect } from 'react';
import { Plus, Check, Wallet, Clock, ArrowRight, UserCheck, TrendingUp, AlertCircle, Search, X, Calendar, CreditCard, Building2 } from 'lucide-react';
import Modal from '../components/Modal';

const DepositRequests = ({ user }) => {
    const [deposits, setDeposits] = useState([]);
    const [banks, setBanks] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        details: '',
        bank_id: '',
        payment_method: 'Bank Transfer',
        deposit_date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const fetchDeposits = () => {
        fetch('http://localhost:8000/api/deposit-requests')
            .then(res => res.json())
            .then(data => setDeposits(data))
            .catch(err => console.error(err));
    };

    const fetchBanks = () => {
        fetch('http://localhost:8000/api/banks')
            .then(res => res.json())
            .then(data => setBanks(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchDeposits();
        fetchBanks();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                bank_id: parseInt(formData.bank_id),
                user_id: user?.id || 1
            };

            const response = await fetch('http://localhost:8000/api/deposit-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({
                    amount: '',
                    details: '',
                    bank_id: '',
                    payment_method: 'Bank Transfer',
                    deposit_date: new Date().toISOString().split('T')[0]
                });
                fetchDeposits();
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (id, status) => {
        if (!confirm(`Are you sure you want to ${status} this request?`)) return;

        try {
            const response = await fetch(`http://localhost:8000/api/deposit-requests/${id}/action`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchDeposits(); // Refresh list to show updated status
                // Also refresh banks context if we had a global store
            } else {
                const err = await response.json();
                alert(err.detail || "Action failed");
            }
        } catch (err) { console.error(err); }
    };

    const filteredDeposits = deposits.filter(d =>
        activeTab === 'Pending' ? d.status === 'Pending' : d.status !== 'Pending'
    );

    const totalPending = deposits.filter(d => d.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const totalApproved = deposits.filter(d => d.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Deposit Requests</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Verify staff deposits against bank entries.</p>
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
                    <Plus size={20} /> New Request
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {['Pending', 'History'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: activeTab === tab ? '#0f172a' : '#f1f5f9',
                                    color: activeTab === tab ? 'white' : '#64748b',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab === 'Pending' ? 'Pending Approval' : 'Transaction History'}
                            </button>
                        ))}
                    </div>

                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={thStyle}>Date</th>
                                    <th style={thStyle}>Amount</th>
                                    <th style={thStyle}>Bank & Details</th>
                                    <th style={thStyle}>Method</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Status / Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeposits.length > 0 ? filteredDeposits.map((dep) => (
                                    <tr key={dep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                                            {dep.deposit_date}
                                        </td>
                                        <td style={{ padding: '20px', fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>
                                            PKR {dep.amount.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600', color: '#334155' }}>
                                                {banks.find(b => b.id === dep.bank_id)?.name || 'Unknown Bank'}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{dep.details}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>
                                                <CreditCard size={14} /> {dep.payment_method}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            {dep.status === 'Pending' ? (
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleAction(dep.id, 'Rejected')}
                                                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }} title="Reject">
                                                        <X size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(dep.id, 'Approved')}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }} title="Approve">
                                                        <Check size={18} /> Approve
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{
                                                    fontWeight: '700',
                                                    color: dep.status === 'Approved' ? '#16a34a' : '#ef4444',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    background: dep.status === 'Approved' ? '#dcfce7' : '#fee2e2',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {dep.status.toUpperCase()}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No {activeTab.toLowerCase()} requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Summary */}
                <div style={{ width: '300px' }}>
                    <div style={{ background: '#0f172a', color: 'white', borderRadius: '24px', padding: '24px', marginBottom: '20px' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', opacity: 0.8 }}>Pending Clearance</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800' }}>PKR {totalPending.toLocaleString()}</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '8px' }}>{filteredDeposits.filter(d => d.status === 'Pending').length} requests waiting</div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#0f172a' }}>Approved Total</h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a' }}>PKR {totalApproved.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Deposit Request">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Target Bank</label>
                        <select
                            style={inputStyle}
                            value={formData.bank_id}
                            onChange={e => setFormData({ ...formData, bank_id: e.target.value })}
                            required
                        >
                            <option value="">Select Bank Account</option>
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>{bank.name} - {bank.account_number}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Deposit Amount</label>
                            <input type="number" style={inputStyle} value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required placeholder="0.00" />
                        </div>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input type="date" style={inputStyle} value={formData.deposit_date} onChange={e => setFormData({ ...formData, deposit_date: e.target.value })} required />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Payment Method</label>
                        <select style={inputStyle} value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })}>
                            <option>Bank Transfer</option>
                            <option>Cash Deposit</option>
                            <option>Online / Mobile App</option>
                            <option>Cheque</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Reference / Details</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            value={formData.details}
                            onChange={e => setFormData({ ...formData, details: e.target.value })}
                            placeholder="Transaction ID, Branch Code, etc."
                            required
                        />
                    </div>

                    <button type="submit" style={{ ...inputStyle, background: '#0d235c', color: 'white', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

const thStyle = { padding: '16px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' };

export default DepositRequests;
