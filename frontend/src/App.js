import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserPage from './pages/UserPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; // Import UnauthorizedPage
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute'; // Import ProtectedRoute

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Protected Routes */}
                        {/* Example: /admin/dashboard requires super_admin role */}
                        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        </Route>

                        {/* Example: /page/:slug requires any authenticated user */}
                        {/* If no allowedRoles is passed, it just checks isAuthenticated */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/page/:slug" element={<UserPage />} />
                            {/* Add other user-specific or general protected routes here */}
                        </Route>
                        
                        {/* Fallback for non-matched routes (optional) */}
                        {/* <Route path="*" element={<NotFoundPage />} /> */}
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;
