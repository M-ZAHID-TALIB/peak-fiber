import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing'; // Import Landing Page
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';
import ISPs from './pages/ISPs';
import Staff from './pages/Staff';
import Areas from './pages/Areas';
import ActionQueue from './pages/ActionQueue';
import Expenses from './pages/Expenses';
import Banks from './pages/Banks';
import DepositRequests from './pages/DepositRequests';
import Promises from './pages/Promises';
import Vouchers from './pages/Vouchers';
import SMSBots from './pages/SMSBots';
import Complaints from './pages/Complaints';
import Inventory from './pages/Inventory';
import InventoryDetail from './pages/InventoryDetail';
import DatabaseAdmin from './pages/DatabaseAdmin';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public Routes are handled differently based on auth state */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />

        {/* Main Application Routing */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user}>
                <Routes>
                  {/* Authenticated Root: Dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Feature Routes */}
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/isps" element={<ISPs />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/areas" element={<Areas />} />
                  <Route path="/queue" element={<ActionQueue />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/banks" element={<Banks user={user} />} />
                  <Route path="/deposits" element={<DepositRequests user={user} />} />
                  <Route path="/promises" element={<Promises />} />
                  <Route path="/vouchers" element={<Vouchers />} />
                  <Route path="/sms-bots" element={<SMSBots />} />
                  <Route path="/complaints" element={<Complaints />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/:category" element={<InventoryDetail />} />
                  <Route path="/database-admin" element={<DatabaseAdmin />} />

                  {/* Fallback for authenticated users */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              // Unauthenticated Flow
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
