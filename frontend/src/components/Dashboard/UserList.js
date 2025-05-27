import React, { useState, useEffect } from 'react';
import userService from '../../services/userService'; // Adjust path

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (err) {
                setError('Failed to load users. Please ensure you are logged in as a Super Admin.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (users.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Super Admin?</th>
                        <th>Actions</th> {/* Placeholder for edit/delete buttons */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email || '-'}</td>
                            <td>{user.first_name || '-'}</td>
                            <td>{user.last_name || '-'}</td>
                            <td>{user.is_super_admin ? 'Yes' : 'No'}</td>
                            <td>
                                {/* Placeholder for action buttons */}
                                <button className="btn btn-sm btn-outline-primary me-1" disabled>Edit</button>
                                <button className="btn btn-sm btn-outline-danger" disabled>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
