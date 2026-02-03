import React from 'react';
import Sidebar from './Sidebar';
import { User, Bell, LogOut } from 'lucide-react';

const Layout = ({ children, user }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <header className="top-bar">
                    <div className="breadcrumb">
                        <span style={{ color: '#666' }}>Home</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Bell size={20} color="#666" style={{ cursor: 'pointer' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>({user.role})</div>
                            </div>
                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#0d235c" />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="page-container">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
