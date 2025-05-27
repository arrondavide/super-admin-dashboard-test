import React, { useState, useEffect } from 'react';
import pageService from '../../services/pageService'; // Adjust path

const PageList = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await pageService.getAllPages();
                setPages(data);
            } catch (err) {
                setError('Failed to load pages. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    if (loading) {
        return <p>Loading pages...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (pages.length === 0) {
        return <p>No pages found.</p>;
    }

    return (
        <div className="list-group">
            {pages.map(page => (
                <div key={page.id || page.slug} className="list-group-item">
                    <h5 className="mb-1">{page.name}</h5>
                    <p className="mb-1 text-muted small">Slug: {page.slug}</p>
                    {page.description && <p className="mb-0 text-muted small">{page.description}</p>}
                </div>
            ))}
        </div>
    );
};

export default PageList;
