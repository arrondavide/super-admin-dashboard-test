import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import PageList from '../components/Dashboard/PageList'; 
import UserList from '../components/Dashboard/UserList'; 
import UserRoleTable from '../components/Dashboard/UserRoleTable';
import PermissionEditPanel from '../components/Dashboard/PermissionEditPanel';
import pageService from '../services/pageService';

const AdminDashboardPage = () => {
    const { user } = useAuth(); 

    const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);
    const [showPermissionPanel, setShowPermissionPanel] = useState(false);
    const [allPagesForPanel, setAllPagesForPanel] = useState([]);
    const [userRoleTableKey, setUserRoleTableKey] = useState(0);
    const [panelError, setPanelError] = useState('');

    useEffect(() => {
        const fetchPagesForPanel = async () => {
            try {
                setPanelError('');
                const pagesData = await pageService.getAllPages();
                setAllPagesForPanel(pagesData);
            } catch (error) {
                console.error("Failed to fetch pages for panel:", error);
                setPanelError('Could not load page list for permission editing.');
                setAllPagesForPanel([]);
            }
        };
        fetchPagesForPanel();
    }, []);

    if (!user) {
        return <p>Loading user information or not authorized...</p>;
    }

    const handleEditUserPermissions = (userData) => { 
        setSelectedUserForPermissions(userData);
        setShowPermissionPanel(true);
    };

    const handleClosePermissionPanel = () => {
        setShowPermissionPanel(false);
        setSelectedUserForPermissions(null);
    };

    const handlePermissionsSaved = () => {
        setUserRoleTableKey(prev => prev + 1); 
        handleClosePermissionPanel();
        alert("Permissions saved actions were processed. UserRoleTable will refresh."); // Updated alert
    };

    return (
        <div className="container-fluid mt-3">
            <h2>Super Admin Dashboard</h2>
            <hr />

            <div className="card mb-4">
                <div className="card-header">
                    Admin User Information
                </div>
                <div className="card-body">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                    <p><strong>Super Admin:</strong> {user.is_super_admin ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            User Management & Permissions Overview
                        </div>
                        <div className="card-body">
                            <h4 className="mt-3">Available Pages</h4>
                            <PageList />
                            <hr />
                            <h4 className="mt-3">All Users</h4>
                            <UserList /> 
                            <hr />
                            <h4 className="mt-3">User Permissions Table</h4>
                            <UserRoleTable key={userRoleTableKey} onEditUser={handleEditUserPermissions} /> 
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {panelError && <div className="alert alert-danger">{panelError}</div>}
                    {showPermissionPanel && selectedUserForPermissions && allPagesForPanel.length > 0 ? (
                        <PermissionEditPanel
                            selectedUserData={selectedUserForPermissions}
                            allPages={allPagesForPanel}
                            onClose={handleClosePermissionPanel}
                            onSavePermissions={handlePermissionsSaved} 
                        />
                    ) : showPermissionPanel && selectedUserForPermissions && allPagesForPanel.length === 0 && !panelError ? (
                        <div className="card"><div className="card-body"><p>Loading page data for panel...</p></div></div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Manage User Permissions</h5>
                                <p className="text-muted">Select a user's 'Edit' button in the User Permissions Table to manage their page access.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
