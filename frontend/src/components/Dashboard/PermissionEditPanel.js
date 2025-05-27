import React, { useState, useEffect } from 'react';
import permissionService from '../../services/permissionService'; // Import the new service

const PERMISSION_CHOICES = ['view', 'edit', 'create', 'delete']; // From backend UserPermission model

const PermissionEditPanel = ({ selectedUserData, allPages, onClose, onSavePermissions }) => {
    const [currentUserPermissions, setCurrentUserPermissions] = useState({});

    useEffect(() => {
        // Initialize panel's state when selectedUserData changes
        if (selectedUserData && allPages && allPages.length > 0) { // Added check for allPages
            const initialPermissions = {};
            allPages.forEach(page => {
                initialPermissions[page.slug] = {};
                const userPagePermissions = selectedUserData.permissions[page.slug] || [];
                PERMISSION_CHOICES.forEach(perm => {
                    initialPermissions[page.slug][perm] = userPagePermissions.includes(perm);
                });
            });
            setCurrentUserPermissions(initialPermissions);
        } else {
            setCurrentUserPermissions({}); // Clear if no user selected or pages not available
        }
    }, [selectedUserData, allPages]);

    if (!selectedUserData) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Manage Permissions</h5>
                    <p className="text-muted">Select a user from the table to manage their page permissions.</p>
                </div>
            </div>
        );
    }
    
    // Ensure allPages is defined before trying to map over it
    if (!allPages || allPages.length === 0) {
        return (
             <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Permissions for: {selectedUserData.user.username}</h5>
                    <p className="text-danger">Page information is not available. Cannot display permissions.</p>
                    <button className="btn btn-secondary mt-2" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }


    const handlePermissionChange = (pageSlug, permissionKey) => {
        setCurrentUserPermissions(prev => ({
            ...prev,
            [pageSlug]: {
                ...prev[pageSlug],
                [permissionKey]: !prev[pageSlug]?.[permissionKey], // Added optional chaining for safety
            },
        }));
    };

    const handleSaveChanges = async () => {
        if (!selectedUserData || !allPages.length) {
            alert("Error: No user selected or pages not loaded.");
            return;
        }

        const addedPermissionsPromises = [];
        const originalUserPermissions = selectedUserData.permissions;

        allPages.forEach(page => {
            const pageSlug = page.slug;
            const pageId = page.id; // Assuming allPages contains page objects with 'id'

            if (currentUserPermissions[pageSlug]) {
                PERMISSION_CHOICES.forEach(permKey => {
                    const isCurrentlyChecked = currentUserPermissions[pageSlug][permKey];
                    const wasOriginallyChecked = (originalUserPermissions[pageSlug] || []).includes(permKey);

                    if (isCurrentlyChecked && !wasOriginallyChecked) {
                        // Add this permission
                        addedPermissionsPromises.push(
                            permissionService.addPermission(selectedUserData.user.id, pageId, permKey)
                        );
                    }
                    // else if (!isCurrentlyChecked && wasOriginallyChecked) {
                    // This is where revoking would happen. Deferred for now.
                    // console.log(`Need to revoke ${permKey} for page ${pageSlug}`);
                    // }
                });
            }
        });

        if (addedPermissionsPromises.length === 0) {
            alert("No new permissions were added.");
            // Optionally close panel if no changes or only revocations (which are deferred)
            // onClose(); 
            return;
        }

        try {
            const results = await Promise.allSettled(addedPermissionsPromises);
            let allSuccessful = true;
            results.forEach(result => {
                if (result.status === 'rejected') {
                    allSuccessful = false;
                    console.error("Failed to save a permission:", result.reason);
                }
            });

            if (allSuccessful) {
                alert("New permissions saved successfully! (Note: Revoking permissions is not yet implemented).");
            } else {
                alert("Some permissions may not have been saved. Check console for errors. (Note: Revoking permissions is not yet implemented).");
            }
        } catch (error) {
            // This catch block might not be strictly necessary with Promise.allSettled
            alert("An unexpected error occurred while saving permissions. (Note: Revoking permissions is not yet implemented).");
            console.error("Error in handleSaveChanges:", error);
        } finally {
            if (onSavePermissions) {
                onSavePermissions(); // This will close the panel and refresh the UserRoleTable
            }
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Permissions for: {selectedUserData.user.username}</h5>
                <button className="btn-close" onClick={onClose} title="Close panel"></button>
            </div>
            <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {allPages.map(page => (
                    <div key={page.slug} className="mb-3 p-2 border rounded">
                        <h6>{page.name} ({page.slug})</h6> {/* Added slug for clarity */}
                        {PERMISSION_CHOICES.map(permKey => (
                            <div className="form-check form-check-inline" key={permKey}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`perm-${selectedUserData.user.id}-${page.slug}-${permKey}`}
                                    checked={currentUserPermissions[page.slug]?.[permKey] || false}
                                    onChange={() => handlePermissionChange(page.slug, permKey)}
                                />
                                <label 
                                    className="form-check-label text-capitalize" 
                                    htmlFor={`perm-${selectedUserData.user.id}-${page.slug}-${permKey}`}
                                >
                                    {permKey}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="card-footer text-end">
                <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default PermissionEditPanel;
