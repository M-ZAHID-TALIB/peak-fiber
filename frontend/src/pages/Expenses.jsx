import React, { useState, useEffect } from 'react';
import { FileText, Plus, DollarSign, Calendar, User, Search, TrendingUp, Filter } from 'lucide-react';
import Modal from '../components/Modal';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Fuel',
        amount: '',
        comments: '',
        staff_name: 'Admin',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    const fetchAll = async () => {
        try {
            const [expRes, staffRes] = await Promise.all([
                fetch('http://localhost:8000/api/expenses'),
                fetch('http://localhost:8000/api/staff')
            ]);
            setExpenses(await expRes.json());
            setStaff(await staffRes.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) })
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ ...formData, amount: '', comments: '' });
                fetchAll();
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div style={{ padding: '20px' }}>
            {/* Header section with Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'white', padding: '15px 25px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '12px' }}>
                        <TrendingUp size={24} color="#dc2626" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Burn</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0d235c' }}>PKR {totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="login-btn"
                        style={{ width: 'auto', padding: '0.8rem 2.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(13, 35, 92, 0.15)' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={20} /> Record Expense
                    </button>
                </div>
            </div>

            <div className="table-container" style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Cash Outflow Log</h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Filter size={14} /> Showing all recent transactions
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Schedule</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? expenses.map((exp) => (
                            <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.85rem' }}>
                                        <Calendar size={14} /> {exp.date}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {exp.type}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '1rem' }}>- PKR {exp.amount.toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {exp.comments || '--'}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#0d235c' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={14} />
                                        </div>
                                        {exp.staff_name}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <Search size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p>No expense records found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Business Expense">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Expense Category</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', marginTop: '8px' }}
                        >
                            <option value="Fuel">Fuel / Convayance</option>
                            <option value="Food">Staff Food / Refreshments</option>
                            <option value="Hardware">Technical Hardware Purchases</option>
                            <option value="Printing">Printing & Stationary</option>
                            <option value="Other">Other Miscellaneous</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Amount (PKR)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            required
                            style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', marginTop: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Expended By (Staff)</label>
                        <select
                            value={formData.staff_name}
                            onChange={e => setFormData({ ...formData, staff_name: e.target.value })}
                            style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', marginTop: '8px' }}
                        >
                            <option value="Admin">System Admin</option>
                            {staff.map(s => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Transaction Details</label>
                        <textarea
                            value={formData.comments}
                            onChange={e => setFormData({ ...formData, comments: e.target.value })}
                            placeholder="Add memo or receipt details..."
                            style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', marginTop: '8px', minHeight: '100px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', background: '#0d235c' }}
                        disabled={loading}
                    >
                        {loading ? 'Recording...' : 'Save Expense Record'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Expenses;
