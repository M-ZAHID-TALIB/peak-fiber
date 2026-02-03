import React, { useState, useEffect } from 'react';
import { Copy, Calendar, Heart, Plus, MessageCircle, AlertTriangle, CheckCircle2, Clock, Trash2, Search } from 'lucide-react';
import Modal from '../components/Modal';

const Promises = () => {
    const [promises, setPromises] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending'); // Pending, Settled
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        username: '',
        phone_number: '',
        due_date: '',
        comments: '',
        date_created: new Date().toLocaleDateString('en-GB')
    });

    const fetchPromises = () => {
        fetch('http://localhost:8000/api/promises')
            .then(res => res.json())
            .then(data => setPromises(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPromises();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/promises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({
                    ...formData,
                    customer_name: '',
                    username: '',
                    phone_number: '',
                    due_date: '',
                    comments: ''
                });
                fetchPromises();
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSettle = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/promises/${id}/settle`, { method: 'POST' });
            if (response.ok) {
                fetchPromises();
                alert("Promise marked as Settled!");
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this promise record?")) return;
        try {
            const response = await fetch(`http://localhost:8000/api/promises/${id}`, { method: 'DELETE' });
            if (response.ok) fetchPromises();
        } catch (err) { console.error(err); }
    };

    const sendWhatsApp = (p) => {
        const message = `Dear ${p.customer_name}, this is a reminder regarding your promise to pay your internet bill by ${p.due_date}. Please clear your dues as soon as possible. - Peak Fiber`;
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${p.phone_number || ''}?text=${encodedMsg}`, '_blank');
    };

    const getDaysOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const filteredPromises = promises.filter(p => {
        const matchesTab = (p.status || 'Pending') === activeTab;
        const matchesSearch = p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.username.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const overdueCount = promises.filter(p => (p.status || 'Pending') === 'Pending' && getDaysOverdue(p.due_date) > 0).length;

    return (
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c', margin: 0 }}>Debt Recoveries</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Track customer promises and follow-ups</p>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {overdueCount > 0 && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '10px' }}>
                                <AlertTriangle size={20} color="#dc2626" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#7f1d1d', textTransform: 'uppercase', fontWeight: '700' }}>Critical Overdue</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#dc2626' }}>{overdueCount} Cases</div>
                            </div>
                        </div>
                    )}

                    <button
                        className="login-btn"
                        style={{ width: 'auto', padding: '0.8rem 2.5rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(13, 35, 92, 0.15)' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={20} /> Record New Promise
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '16px', padding: '5px', gap: '5px' }}>
                    {['Pending', 'Settled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.6rem 2rem',
                                border: 'none',
                                borderRadius: '12px',
                                background: activeTab === tab ? '#0d235c' : 'transparent',
                                color: activeTab === tab ? 'white' : '#64748b',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search debtor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '250px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredPromises.length > 0 ? filteredPromises.map((promise) => {
                    const daysOverdue = getDaysOverdue(promise.due_date);
                    const isOverdue = daysOverdue > 0 && (promise.status || 'Pending') === 'Pending';

                    return (
                        <div key={promise.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #f1f5f9',
                            borderLeft: isOverdue ? '6px solid #ef4444' : (promise.status === 'Settled' ? '6px solid #059669' : '6px solid #3b82f6'),
                            gap: '24px'
                        }}>
                            {/* Status Icon */}
                            <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
                                {promise.status === 'Settled' ? (
                                    <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '50%' }}>
                                        <CheckCircle2 size={24} color="#059669" />
                                    </div>
                                ) : isOverdue ? (
                                    <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '50%' }}>
                                        <AlertTriangle size={24} color="#dc2626" />
                                    </div>
                                ) : (
                                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%' }}>
                                        <Clock size={24} color="#3b82f6" />
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 1fr 1.5fr 120px', gap: '20px', alignItems: 'center' }}>
                                {/* User Info */}
                                <div>
                                    <div style={{ fontWeight: '700', color: '#0d235c', fontSize: '1.1rem' }}>{promise.customer_name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                        {promise.username} <Copy size={12} color="#4f46e5" style={{ cursor: 'pointer' }} />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Promise Date</div>
                                    <div style={{ color: '#475569', fontWeight: '600' }}>{new Date(promise.due_date).toLocaleDateString()}</div>
                                </div>

                                {/* Status Text */}
                                <div>
                                    {isOverdue ? (
                                        <span style={{ color: '#dc2626', fontWeight: '800', background: '#fef2f2', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                            OVERDUE (+{daysOverdue} days)
                                        </span>
                                    ) : promise.status === 'Settled' ? (
                                        <span style={{ color: '#059669', fontWeight: '800', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                            SETTLED
                                        </span>
                                    ) : (
                                        <span style={{ color: '#3b82f6', fontWeight: '800', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                            UPCOMING
                                        </span>
                                    )}
                                </div>

                                {/* Comments */}
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#4b5563', fontStyle: 'italic', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                                        "{promise.comments}"
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    {(promise.status || 'Pending') === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => sendWhatsApp(promise)}
                                                title="Send WhatsApp Reminder"
                                                style={{ background: '#dcfce7', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#166534' }}
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleSettle(promise.id)}
                                                title="Mark as Settled"
                                                style={{ background: '#dbeafe', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#1e40af' }}
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(promise.id)}
                                        title="Delete Record"
                                        style={{ background: '#fee2e2', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#991b1b' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{ background: 'white', padding: '6rem', textAlign: 'center', borderRadius: '20px', color: '#94a3b8', border: '1px dashed #e2e8f0' }}>
                        <Heart size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>No records found in {activeTab} list.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Track Promise to Pay">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Customer Information</label>
                        <input type="text" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} placeholder="Full Name" required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                    </div>

                    <div className="input-group">
                        <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Account Reference / CID" required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                    </div>

                    <div className="input-group">
                        <input type="text" value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} placeholder="Phone Number (923...)" required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Promise Deadline</label>
                        <input type="date" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Reason / Notes</label>
                        <textarea
                            value={formData.comments}
                            onChange={e => setFormData({ ...formData, comments: e.target.value })}
                            placeholder="Reason for delay..."
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', minHeight: '100px' }}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" style={{ padding: '1rem', borderRadius: '14px', fontWeight: '800', fontSize: '1.1rem', background: '#0d235c' }} disabled={loading}>
                        {loading ? 'Saving...' : 'Start Tracking'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Promises;
