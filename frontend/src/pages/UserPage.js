import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import commentService from '../services/commentService'; // Adjust path
import { useAuth } from '../contexts/AuthContext'; // To get current user for new comments
import { Modal, Button } from 'react-bootstrap'; // Import Modal components

const UserPage = () => {
    const { slug } = useParams();
    const { user, isAuthenticated } = useAuth(); // Get user info

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [errorComments, setErrorComments] = useState('');
    
    const [newCommentContent, setNewCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null); // Added for edit state
    const [editingContent, setEditingContent] = useState(''); // Added for edit state
    const [submitCommentError, setSubmitCommentError] = useState('');

    // State for comment history modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedCommentForHistory, setSelectedCommentForHistory] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Fetch comments function
    const fetchComments = useCallback(async () => {
        try {
            setLoadingComments(true);
            setErrorComments('');
            const data = await commentService.getCommentsByPageSlug(slug);
            setComments(data);
        } catch (err) {
            setErrorComments(`Failed to load comments for page '${slug}'.`);
            console.error(err);
        } finally {
            setLoadingComments(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchComments();
        }
    }, [slug, fetchComments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) {
            setSubmitCommentError("Comment cannot be empty.");
            return;
        }
        if (!isAuthenticated()) {
            setSubmitCommentError("You must be logged in to comment.");
            return;
        }

        setSubmittingComment(true);
        setSubmitCommentError('');
        try {
            await commentService.addComment(slug, newCommentContent);
            setNewCommentContent(''); // Clear textarea
            fetchComments(); // Refresh comments list
        } catch (err) {
            setSubmitCommentError("Failed to post comment. Please try again.");
            console.error(err);
        } finally {
            setSubmittingComment(false);
        }
    };

    // Functions for comment history modal
    const handleShowHistory = async (comment) => {
        setSelectedCommentForHistory(comment);
        setShowHistoryModal(true);
        setLoadingHistory(true);
        try {
            const data = await commentService.getCommentHistory(comment.id);
            setHistoryData(data);
        } catch (err) {
            console.error("Failed to fetch comment history", err);
            setHistoryData([]); // Clear previous data on error
            alert("Failed to load history.");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleCloseHistoryModal = () => {
        setShowHistoryModal(false);
        setHistoryData([]);
        setSelectedCommentForHistory(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Page: <span className="text-primary">{slug}</span></h2>
            
            {/* Section to Add New Comment */}
            {isAuthenticated() && ( // Show add comment form only if authenticated
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Add a Comment</h5>
                        <form onSubmit={handleAddComment}>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    placeholder="Write your comment here..."
                                    required
                                />
                            </div>
                            {submitCommentError && <div className="alert alert-danger py-2">{submitCommentError}</div>}
                            <button type="submit" className="btn btn-primary" disabled={submittingComment}>
                                {submittingComment ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Section to Display Comments */}
            <div className="mt-4">
                <h4>Comments</h4>
                {loadingComments && <p>Loading comments...</p>}
                {errorComments && <div className="alert alert-danger">{errorComments}</div>}
                {!loadingComments && !errorComments && comments.length === 0 && (
                    <p>No comments yet. Be the first to comment!</p>
                )}
                {!loadingComments && !errorComments && comments.length > 0 && (
                    <div className="list-group">
                        {comments.map(comment => (
                            <div key={comment.id} className="list-group-item mb-2 shadow-sm">
                                {editingCommentId === comment.id ? (
                                    // Editing Mode
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        try {
                                            await commentService.updateComment(comment.id, editingContent);
                                            setEditingCommentId(null);
                                            fetchComments(); // Refresh comments
                                        } catch (err) {
                                            // Handle error (e.g., display a message next to the form)
                                            alert("Failed to update comment."); 
                                            console.error("Update comment error:", err);
                                        }
                                    }}>
                                        <textarea
                                            className="form-control mb-2"
                                            rows="3"
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="btn btn-sm btn-success me-2">Save</button>
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingCommentId(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    // Display Mode
                                    <>
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-1 text-info">
                                                {comment.author ? comment.author.username : 'Unknown User'}
                                            </h6>
                                            <small className="text-muted">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </small>
                                        </div>
                                        <p className="mb-1">{comment.content}</p>
                                        {comment.is_edited && <small className="text-muted fst-italic">(Edited)</small>}
                                        
                                        {isAuthenticated() && (user?.id === comment.author?.id || user?.is_super_admin) && (
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary me-2" 
                                                    onClick={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditingContent(comment.content);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to delete this comment?")) {
                                                            try {
                                                                await commentService.deleteComment(comment.id);
                                                                fetchComments(); // Refresh comments
                                                            } catch (err) {
                                                                alert("Failed to delete comment.");
                                                                console.error("Delete comment error:", err);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                                {user?.is_super_admin && (
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() => handleShowHistory(comment)}
                                                        title="View modification history"
                                                    >
                                                        History
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Comment History Modal */}
            {selectedCommentForHistory && (
                <Modal show={showHistoryModal} onHide={handleCloseHistoryModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Modification History for Comment by: {selectedCommentForHistory.author?.username || 'Unknown'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {loadingHistory ? (
                            <p>Loading history...</p>
                        ) : historyData.length > 0 ? (
                            <ul className="list-group">
                                {historyData.map(record => (
                                    <li key={record.id} className="list-group-item">
                                        <p className="mb-1"><strong>Old Content:</strong></p>
                                        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                                            {record.old_content}
                                        </pre>
                                        <small className="text-muted">
                                            Modified by: {record.modified_by?.username || 'Unknown User'} on {new Date(record.modified_at).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No modification history found for this comment.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseHistoryModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default UserPage;
