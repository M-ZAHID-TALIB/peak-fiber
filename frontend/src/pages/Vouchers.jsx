import React, { useState, useEffect } from 'react';
import { Copy, Plus, Ticket, Users, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';

const Vouchers = () => {
    const [activeTab, setActiveTab] = useState('Unused');
    const [vouchers, setVouchers] = useState([]);
    const [isps, setIsps] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        amount: 1500,
        type: 'Every Month',
        isp_name: 'All ISPs',
        assigned_to: 'General Inventory',
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
        count: 1
    });

    const fetchData = async () => {
        try {
            const vRes = await fetch('http://localhost:8000/api/vouchers');
            const vData = await vRes.json();
            setVouchers(Array.isArray(vData) ? vData : []);

            const iRes = await fetch('http://localhost:8000/api/isps');
            const iData = await iRes.json();
            setIsps(Array.isArray(iData) ? iData : []);

            const sRes = await fetch('http://localhost:8000/api/staff');
            const sData = await sRes.json();
            setStaff(Array.isArray(sData) ? sData : []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Sending voucher data:", formData);
            const response = await fetch('http://localhost:8000/api/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                setFormData({
                    ...formData,
                    amount: 1500,
                    count: 1
                });
                await fetchData();
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Error: " + (errorData.detail?.[0]?.msg || "Server failed to generate vouchers"));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network connection failed. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const filteredVouchers = Array.isArray(vouchers) ? vouchers.filter(v => activeTab === 'Unused' ? !v.is_used : v.is_used) : [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0d235c' }}>Voucher Management</h2>
                <button
                    className="login-btn"
                    style={{ width: 'auto', padding: '0.6rem 2rem' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Generate Batch
                </button>
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '2rem' }}>
                {['Unused', 'Used'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeTab === tab ? '#0d235c' : 'transparent',
                            color: activeTab === tab ? 'white' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {tab === 'Unused' ? 'Available (Ready)' : 'History (Used)'}
                    </button>
                ))}
            </div>

            <div className="table-container">
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0d235c' }}>{activeTab} Vouchers</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Serial / Batch</th>
                            <th>Amount</th>
                            <th>Assigned To</th>
                            <th>ISP Provider</th>
                            <th>Expiry</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVouchers.length > 0 ? filteredVouchers.map((v) => (
                            <tr key={v.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '700' }}>
                                        <Ticket size={16} /> {v.number}
                                        <Copy size={14} style={{ cursor: 'pointer' }} onClick={() => {
                                            navigator.clipboard.writeText(v.number);
                                            alert("Copied!");
                                        }} />
                                    </div>
                                    <div style={{ fontSize: '0.6rem', color: '#999' }}>{v.batch_id}</div>
                                </td>
                                <td style={{ fontWeight: '700', color: '#059669' }}>PKR {v.amount}</td>
                                <td>{v.assigned_to || 'General'}</td>
                                <td>{v.isp_name || 'All ISPs'}</td>
                                <td style={{ color: '#dc2626', fontWeight: '500' }}>{v.expiry_date}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        background: v.is_used ? '#fef2f2' : '#ecfdf5',
                                        color: v.is_used ? '#dc2626' : '#059669'
                                    }}>
                                        {v.is_used ? 'USED' : 'READY'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                                    No vouchers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Voucher Batch">
                <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="input-group">
                        <label>Amount (PKR)</label>
                        <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} required />
                    </div>
                    <div className="input-group">
                        <label>Count (Quantity)</label>
                        <input type="number" value={formData.count} onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })} min="1" max="100" required />
                    </div>
                    <div className="input-group">
                        <label>ISP</label>
                        <select value={formData.isp_name} onChange={e => setFormData({ ...formData, isp_name: e.target.value })} required>
                            <option value="All ISPs">Universal (All ISPs)</option>
                            {isps.map(isp => <option key={isp.id} value={isp.name}>{isp.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Assign To</label>
                        <select value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })} required>
                            <option value="General Inventory">General Inventory</option>
                            {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Expiry Date</label>
                        <input type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} required />
                    </div>

                    <button type="submit" className="login-btn" style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : null}
                        {loading ? 'Generating...' : 'Confirm & Generate'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Vouchers;
