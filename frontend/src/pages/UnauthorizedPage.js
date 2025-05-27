import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="container text-center mt-5">
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
    );
};

export default UnauthorizedPage;
