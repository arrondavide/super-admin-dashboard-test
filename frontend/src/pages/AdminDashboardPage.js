import React, { useState, useEffect } from 'react'; // Added useEffect, useState
import { useAuth } from '../contexts/AuthContext'; 
import PageList from '../../components/Dashboard/PageList'; 
import UserList from '../../components/Dashboard/UserList'; 
import UserRoleTable from '../../components/Dashboard/UserRoleTable';
import PermissionEditPanel from '../../components/Dashboard/PermissionEditPanel'; // Import PermissionEditPanel
import pageService from '../../services/pageService'; // Import pageService

const AdminDashboardPage = () => {
    const { user } = useAuth(); 

    const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);
    const [showPermissionPanel, setShowPermissionPanel] = useState(false);
    const [allPagesForPanel, setAllPagesForPanel] = useState([]);
    const [userRoleTableKey, setUserRoleTableKey] = useState(0); // To force re-fetch if needed
    const [panelError, setPanelError] = useState('');


    useEffect(() => {
        const fetchPagesForPanel = async () => {
            try {
                setPanelError('');
                const pagesData = await pageService.getAllPages(); // Assuming UserRoleTable gets its own full data
                setAllPagesForPanel(pagesData);
            } catch (error) {
                console.error("Failed to fetch pages for panel:", error);
                setPanelError('Could not load page list for permission editing.');
                setAllPagesForPanel([]); // Ensure it's an empty array on error
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
        // TODO: Show success message
        alert("Permissions saved (mock). UserRoleTable will refresh.");
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
                            <h4>Available Pages (Read-only list)</h4>
                            <PageList />
                            <hr />
                            <h4>All Users (Read-only list)</h4>
                            <UserList /> 
                            <hr />
                            <h4>User Permissions Table</h4>
                            {/* Pass onEditUser to UserRoleTable */}
                            <UserRoleTable key={userRoleTableKey} onEditUser={handleEditUserPermissions} /> 
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {panelError && <div className="alert alert-danger">{panelError}</div>}
                    {showPermissionPanel && selectedUserForPermissions ? (
                        <PermissionEditPanel
                            selectedUserData={selectedUserForPermissions}
                            allPages={allPagesForPanel}
                            onClose={handleClosePermissionPanel}
                            onSavePermissions={handlePermissionsSaved} 
                        />
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Manage User Permissions</h5>
                                <p className="text-muted">Select a user from the 'Edit' button in the User Permissions Table to manage their page access.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-4">
            </div>
        </div>
    );
};

export default AdminDashboardPage;
