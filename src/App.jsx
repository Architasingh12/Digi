import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './portal/contexts/AuthContext';
import ProtectedRoute from './portal/components/ProtectedRoute';

// Pages
import AdminLogin from './portal/pages/AdminLogin';
import ParticipantLogin from './portal/pages/ParticipantLogin';
import AdminDashboard from './portal/pages/AdminDashboard';
import ParticipantDashboard from './portal/pages/ParticipantDashboard';
import Assessment from './components/Assessment';

import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App min-h-screen bg-[#070b14]">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/participant/login" element={<ParticipantLogin />} />

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>

                        {/* Participant Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['participant']} />}>
                            <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
                            <Route path="/assessment" element={<Assessment />} />
                        </Route>

                        {/* Default Redirects */}
                        <Route path="/" element={<Navigate to="/participant/login" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
