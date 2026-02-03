import React, { useState, useEffect } from 'react';
import { User, Plus, DollarSign, RefreshCcw, Phone, Shield } from 'lucide-react';
import Modal from '../components/Modal';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', role: 'LINEMAN' });

    const fetchStaff = () => {
        fetch('http://localhost:8000/api/staff')
            .then(res => res.json())
            .then(data => setStaff(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', phone: '', role: 'LINEMAN' });
                fetchStaff();
            } else {
                const err = await response.json();
                console.error("Failed to add staff:", err);
                alert("Failed to add staff: " + (err.detail || "Unknown error"));
            }
        } catch (err) { console.error(err); }
    };

    const handleResetCash = async (id, name) => {
        if (!window.confirm(`Are you sure you have received all cash from ${name}? This will reset their wallet to 0.`)) return;

        try {
            const response = await fetch(`http://localhost:8000/api/staff/${id}/reset-cash`, {
                method: 'POST'
            });
            if (response.ok) fetchStaff();
        } catch (err) { console.error(err); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0d235c' }}>Staff Management</h2>
                <button
                    className="login-btn"
                    style={{ width: 'auto', padding: '0.6rem 2rem' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Add Team Member
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {staff.map((person) => (
                    <div key={person.id} style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: '8px 15px',
                            background: person.role === 'ADMIN' ? '#eff6ff' : '#f8fafc',
                            color: person.role === 'ADMIN' ? '#3b82f6' : '#64748b',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            borderBottomLeftRadius: '12px',
                            textTransform: 'uppercase'
                        }}>
                            {person.role}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '14px',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid #e2e8f0'
                            }}>
                                {person.profile_pic ? (
                                    <img
                                        src={person.profile_pic}
                                        alt={person.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d235c" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                        }}
                                    />
                                ) : (
                                    <User size={30} color="#0d235c" />
                                )}
                            </div>
                            <div>
                                <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b', margin: 0 }}>{person.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                                    <Phone size={12} /> {person.phone}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: person.cash > 0 ? '#ecfdf5' : '#f8fafc',
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: person.cash > 0 ? '1px solid #10b98133' : '1px solid #e2e8f0'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Collection</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: person.cash > 0 ? '#059669' : '#1e293b' }}>
                                    PKR {person.cash.toLocaleString()}
                                </div>
                            </div>
                            {person.cash > 0 && (
                                <button
                                    onClick={() => handleResetCash(person.id, person.name)}
                                    style={{
                                        background: '#0d235c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <RefreshCcw size={14} /> Collect
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Staff Member">
                <form onSubmit={handleCreate}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Imran Khan" required />
                    </div>
                    <div className="input-group">
                        <label>WhatsApp Number</label>
                        <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g. 923001234567" required />
                    </div>
                    <div className="input-group">
                        <label>Designation / Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }}
                        >
                            <option value="LINEMAN">LINEMAN (Field Staff)</option>
                            <option value="CASHIER">CASHIER (Office Staff)</option>
                            <option value="RMAN">RECOVERY MAN</option>
                            <option value="ADMIN">ADMINISTRATOR</option>
                        </select>
                    </div>
                    <button type="submit" className="login-btn" style={{ marginTop: '1.5rem' }}>Save Staff Member</button>
                </form>
            </Modal>
        </div>
    );
};

export default Staff;
