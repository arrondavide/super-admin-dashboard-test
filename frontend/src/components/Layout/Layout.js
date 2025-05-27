import React from 'react';
import './Layout.css'; // We'll create this for basic styling

// Import Bootstrap CSS globally here
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <header className="layout-header bg-dark text-white p-3">
                {/* Placeholder for a Navbar or Header content */}
                <h1>Super Admin Dashboard</h1>
            </header>
            <main className="layout-main-content container py-4">
                {children} {/* Page specific content will be rendered here */}
            </main>
            <footer className="layout-footer bg-light text-center p-3">
                {/* Placeholder for footer content */}
                <p>&copy; {new Date().getFullYear()} My Dashboard App</p>
            </footer>
        </div>
    );
};

export default Layout;
