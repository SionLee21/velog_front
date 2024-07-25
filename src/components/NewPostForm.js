import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPostForm.css';
import axios from 'axios';

const NewPostForm = () => {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            description,
            author: 'current_user', // Replace with actual author if available
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            comments: 0
        };

        try {
            await axios.post('https://mumuk.store/api/posts', newPost);
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="new-post-form-container">
            <form onSubmit={handleSubmit} className="new-post-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="title-input"
                    required
                />
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="태그를 입력하세요"
                    className="tags-input"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="당신의 이야기를 적어보세요..."
                    className="description-input"
                    required
                />
                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>나가기</button>
                    <div className="right-buttons">
                        <button type="button" className="save-button">임시저장</button>
                        <button type="submit" className="submit-button" disabled={!title || !description}>출간하기</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewPostForm;
