import React, { useState, useEffect } from 'react';
import userService from '../../services/userService'; // Adjust path

const UserRoleTable = ({ onEditUser, key }) => { // Added onEditUser prop and key
    const [tableData, setTableData] = useState({ users: [], pages: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await userService.getUserRoleTableData();
                setTableData(data);
            } catch (err) {
                setError('Failed to load user role data. Please ensure you are logged in as a Super Admin.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTableData();
    }, [key]); // Added key to useEffect dependency to re-fetch when key changes

    if (loading) {
        return <p>Loading user role table...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const { users, pages } = tableData;

    if (users.length === 0 || pages.length === 0) {
        return <p>No users or pages found to display in the role table.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th style={{ minWidth: '150px' }}>User</th>
                        {pages.map(page => (
                            <th key={page.slug} title={page.description || page.name} style={{ minWidth: '120px' }}>
                                {page.name}
                            </th>
                        ))}
                        <th style={{ minWidth: '100px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(userData => (
                        <tr key={userData.user.id}>
                            <td>
                                <strong>{userData.user.username}</strong><br/>
                                <small className="text-muted">{userData.user.email}</small>
                            </td>
                            {pages.map(page => {
                                const permissions = userData.permissions[page.slug] || [];
                                return (
                                    <td key={page.slug}>
                                        {permissions.length > 0 ? permissions.join(', ') : <span className="text-muted">No Access</span>}
                                    </td>
                                );
                            })}
                            <td>
                                <button 
                                    className="btn btn-sm btn-outline-primary" 
                                    title={`Edit permissions for ${userData.user.username}`}
                                    onClick={() => onEditUser(userData)} // Call onEditUser with user's data
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRoleTable;
