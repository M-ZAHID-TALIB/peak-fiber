import React, { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, AlertTriangle, User, CheckCircle, Clock } from 'lucide-react';
import Modal from '../components/Modal';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        complaint_type: 'No Internet',
        priority: 'HIGH',
        connection_details: '',
        assigned_to: 'Unassigned'
    });

    const fetchAll = () => {
        fetch('http://localhost:8000/api/complaints')
            .then(res => res.json())
            .then(data => setComplaints(data))
            .catch(err => console.error(err));

        fetch('http://localhost:8000/api/staff')
            .then(res => res.json())
            .then(data => setStaff(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const ticket_id = `PF-${Math.floor(100000 + Math.random() * 900000)}`;
        const payload = {
            ...formData,
            ticket_id,
            status: 'OPEN',
            created_at: new Date().toLocaleString(),
            created_by: 'Azhar Waheed'
        };
        try {
            const response = await fetch('http://localhost:8000/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ title: '', complaint_type: 'No Internet', priority: 'HIGH', connection_details: '', assigned_to: 'Unassigned' });
                fetchAll();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8000/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) fetchAll();
        } catch (err) { console.error(err); }
    };

    const assignStaff = async (id, assigned_to) => {
        try {
            const response = await fetch(`http://localhost:8000/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigned_to, status: 'ASSIGNED' })
            });
            if (response.ok) fetchAll();
        } catch (err) { console.error(err); }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesTab = activeTab === 'All' || c.status === activeTab.toUpperCase();
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.connection_details.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'OPEN').length,
        assigned: complaints.filter(c => c.status === 'ASSIGNED').length,
        closed: complaints.filter(c => c.status === 'CLOSED').length,
    };

    return (
        <div>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4f46e5', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Tickets</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d235c' }}>{stats.total}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Active Open</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.open}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Assigned</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.assigned}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Resolved</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.closed}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
                    {['All', 'Open', 'Assigned', 'Closed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                border: 'none',
                                borderRadius: '8px',
                                background: activeTab === tab ? '#0d235c' : 'transparent',
                                color: activeTab === tab ? 'white' : '#666',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.6rem 2.5rem 0.6rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', width: '300px' }}
                        />
                        <Search size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    </div>
                    <button
                        className="login-btn"
                        style={{ width: 'auto', padding: '0.6rem 2.5rem' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        New Ticket
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ticket Info</th>
                            <th>Customer / Type</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <div style={{ fontWeight: '700', color: '#4f46e5' }}>{c.ticket_id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{c.created_at}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '600' }}>{c.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>CID: {c.connection_details} | {c.complaint_type}</div>
                                </td>
                                <td>
                                    <span style={{
                                        color: c.priority === 'CRITICAL' ? '#dc2626' : (c.priority === 'HIGH' ? '#d97706' : '#6b7280'),
                                        fontWeight: '700',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <AlertTriangle size={14} /> {c.priority}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        background: c.status === 'OPEN' ? '#fffbeb' : (c.status === 'ASSIGNED' ? '#eff6ff' : '#ecfdf5'),
                                        color: c.status === 'OPEN' ? '#d97706' : (c.status === 'ASSIGNED' ? '#3b82f6' : '#059669')
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={c.assigned_to}
                                        onChange={(e) => assignStaff(c.id, e.target.value)}
                                        style={{ fontSize: '0.8rem', padding: '4px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                    >
                                        <option value="Unassigned">Unassigned</option>
                                        {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {c.status !== 'CLOSED' && (
                                            <button
                                                onClick={() => updateStatus(c.id, 'CLOSED')}
                                                style={{ border: 'none', background: '#ecfdf5', color: '#059669', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                                            >
                                                Confirm Fix
                                            </button>
                                        )}
                                        {c.status === 'CLOSED' && <CheckCircle size={18} color="#10b981" />}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <div>No complaints matched your current view.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Support Ticket">
                <form onSubmit={handleCreate}>
                    <div className="input-group">
                        <label>Issue Description</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Router red light blinking" required />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <select value={formData.complaint_type} onChange={e => setFormData({ ...formData, complaint_type: e.target.value })}>
                            <option value="No Internet">No Internet / Fiber Break</option>
                            <option value="Slow Speed">Slow Speed / Buffer Issues</option>
                            <option value="Package Activation">Payment/Package Activation</option>
                            <option value="Hardware">Hardware Fault</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Priority Level</label>
                        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                            <option value="NORMAL">NORMAL</option>
                            <option value="HIGH">HIGH (Urgent)</option>
                            <option value="CRITICAL">CRITICAL (VVIP/Commercial)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Customer CID / Phone</label>
                        <input type="text" value={formData.connection_details} onChange={e => setFormData({ ...formData, connection_details: e.target.value })} placeholder="Enter customer reference" required />
                    </div>
                    <button type="submit" className="login-btn" style={{ marginTop: '1.5rem' }}>Create Support Ticket</button>
                </form>
            </Modal>
        </div>
    );
};

export default Complaints;
