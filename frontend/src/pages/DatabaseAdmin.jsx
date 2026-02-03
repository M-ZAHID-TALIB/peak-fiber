import React, { useState, useEffect } from 'react';
import { Database, Table, Plus, Edit, Trash2, RefreshCw, Search, ChevronRight, Eye } from 'lucide-react';
import Modal from '../components/Modal';

const DatabaseAdmin = () => {
    const [tables, setTables] = useState([
        { name: 'Users', endpoint: '/api/users', icon: '👤', color: '#3b82f6' },
        { name: 'ISPs', endpoint: '/api/isps', icon: '🌐', color: '#10b981' },
        { name: 'Connections', endpoint: '/api/connections', icon: '🔌', color: '#f59e0b' },
        { name: 'Staff', endpoint: '/api/staff', icon: '👥', color: '#8b5cf6' },
        { name: 'Areas', endpoint: '/api/areas', icon: '📍', color: '#ec4899' },
        { name: 'Inventory', endpoint: '/api/inventory-all', icon: '📦', color: '#06b6d4' },
        { name: 'Expenses', endpoint: '/api/expenses', icon: '💰', color: '#ef4444' },
        { name: 'Banks', endpoint: '/api/banks', icon: '🏦', color: '#14b8a6' },
        { name: 'Deposits', endpoint: '/api/deposits', icon: '💵', color: '#f97316' },
        { name: 'Promises', endpoint: '/api/promises', icon: '🤝', color: '#a855f7' },
        { name: 'Vouchers', endpoint: '/api/vouchers', icon: '🎟️', color: '#84cc16' },
        { name: 'SMS Bots', endpoint: '/api/sms-bots', icon: '📱', color: '#6366f1' },
        { name: 'Complaints', endpoint: '/api/complaints', icon: '📢', color: '#dc2626' },
        { name: 'Action Queue', endpoint: '/api/action-queue', icon: '⚡', color: '#0891b2' },
    ]);

    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchTableData = async (table) => {
        setLoading(true);
        setSelectedTable(table);
        try {
            const response = await fetch(`http://localhost:8000${table.endpoint}`);
            const data = await response.json();
            setTableData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching table data:', error);
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        try {
            await fetch(`http://localhost:8000${selectedTable.endpoint}/${id}`, {
                method: 'DELETE'
            });
            fetchTableData(selectedTable);
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record');
        }
    };

    const viewRecord = (record) => {
        setSelectedRecord(record);
        setIsViewModalOpen(true);
    };

    const filteredData = tableData.filter(record =>
        JSON.stringify(record).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
                    }}>
                        <Database size={30} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0d235c', margin: 0 }}>
                            Database Administration
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
                            Manage all system tables and records
                        </p>
                    </div>
                </div>
            </div>

            {!selectedTable ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {tables.map((table, index) => (
                        <div
                            key={index}
                            onClick={() => fetchTableData(table)}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '2rem',
                                cursor: 'pointer',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: table.color,
                                opacity: 0.05,
                                borderRadius: '50%'
                            }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '14px',
                                    background: `${table.color}15`
                                }}>
                                    {table.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                        {table.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                        View & Manage
                                    </p>
                                </div>
                                <ChevronRight size={24} color={table.color} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button
                                onClick={() => setSelectedTable(null)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#475569'
                                }}
                            >
                                ← Back to Tables
                            </button>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0d235c', margin: 0 }}>
                                {selectedTable.icon} {selectedTable.name}
                            </h3>
                            <span style={{
                                background: '#eff6ff',
                                color: '#3b82f6',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                {filteredData.length} records
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        width: '250px'
                                    }}
                                />
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            </div>
                            <button
                                onClick={() => fetchTableData(selectedTable)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#eff6ff',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <RefreshCw size={18} /> Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                            <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite' }} />
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                            {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
                                                <th key={key} style={{
                                                    textAlign: 'left',
                                                    padding: '1rem',
                                                    color: '#64748b',
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontWeight: '700'
                                                }}>
                                                    {key.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                            <th style={{
                                                textAlign: 'center',
                                                padding: '1rem',
                                                color: '#64748b',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontWeight: '700'
                                            }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((record, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                {Object.values(record).map((value, i) => (
                                                    <td key={i} style={{
                                                        padding: '1rem',
                                                        color: '#334155',
                                                        fontSize: '0.9rem',
                                                        maxWidth: '200px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </td>
                                                ))}
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => viewRecord(record)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#eff6ff',
                                                                color: '#3b82f6',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(record.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#fef2f2',
                                                                color: '#dc2626',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredData.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <Table size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No records found in this table</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* View Record Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Record Details"
                maxWidth="600px"
            >
                {selectedRecord && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {Object.entries(selectedRecord).map(([key, value]) => (
                            <div key={key} style={{
                                padding: '15px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '6px',
                                    fontWeight: '700'
                                }}>
                                    {key.replace(/_/g, ' ')}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: '#1e293b',
                                    fontWeight: '600',
                                    wordBreak: 'break-word'
                                }}>
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default DatabaseAdmin;
