import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import authService from '../services/authService'; // Replaced by useAuth
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const LoginPage = () => {
    const auth = useAuth(); // Get auth context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Username and password are required.');
            setLoading(false);
            return;
        }

        try {
            // Use the login function from AuthContext
            const data = await auth.login(username, password); 
            
            // Navigation logic remains here based on response
            if (data.user && data.user.is_super_admin) {
                navigate('/admin/dashboard');
            } else if (data.user) {
                // For regular users, you might redirect to a generic page or their first permitted page
                // For now, let's redirect to a placeholder page or home.
                // Example: navigate('/user/profile') or navigate('/') and let HomePage handle it
                // For now, let's make a generic user page for testing.
                // We can create a /dashboard for regular users later or use the first page from their permissions.
                navigate('/page/default-user-page'); // Placeholder, adjust as needed
            } else {
                // Should not happen if login is successful and returns user data
                setError('Login successful, but no user data received.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="usernameInput" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usernameInput"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        aria-describedby="usernameHelp"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
