import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Wifi, Package, UserCheck, MapPin, ListChecks, DollarSign, Landmark, CreditCard, Heart, Ticket, MessageSquare, Bot, Database } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Connections', icon: Wifi, path: '/connections' },
        { name: 'ISPs', icon: Users, path: '/isps' },
        { name: 'Inventory', icon: Package, path: '/inventory' },
        { name: 'Staff', icon: UserCheck, path: '/staff' },
        { name: 'Areas', icon: MapPin, path: '/areas' },
        { name: 'Action Queue', icon: ListChecks, path: '/queue' },
        { name: 'Expenses', icon: DollarSign, path: '/expenses' },
        { name: 'Banks', icon: Landmark, path: '/banks' },
        { name: 'Deposit Requests', icon: CreditCard, path: '/deposits' },
        { name: 'Promises', icon: Heart, path: '/promises' },
        { name: 'Vouchers', icon: Ticket, path: '/vouchers' },
        { name: 'SMS Bots', icon: Bot, path: '/sms-bots' },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
        { name: 'Database Admin', icon: Database, path: '/database-admin' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '1.2rem' }}>Peak Fiber</span>
                </div>
            </div>
            <nav className="nav-links">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
