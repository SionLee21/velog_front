import React from 'react';
import Card from './Card';
import './HomePage.css';

const HomePage = ({ posts, searchTerm }) => {
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '')
    );

    return (
        <div className="card-container">
            {filteredPosts.map(post => (
                <Card key={post.id} {...post} />
            ))}
        </div>
    );
};

export default HomePage;
