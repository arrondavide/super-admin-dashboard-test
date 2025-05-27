import React from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
    const { slug } = useParams(); // Example of getting a URL parameter
    return (
        <div>
            <h2>Page: {slug}</h2>
            {/* Content for a generic user-accessible page, including comments, will go here */}
            <p>This is content for page with slug: {slug}</p>
        </div>
    );
};

export default UserPage;
