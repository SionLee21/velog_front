import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditPostPage.css';

const EditPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', description: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://mumuk.store/api/posts/${postId}`);
                setPost(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://mumuk.store/api/posts/${postId}`, post);
            navigate(`/post/${postId}`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="edit-post-page">
            <form onSubmit={handleSubmit} className="edit-post-form">
                <h2>글 수정</h2>
                <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleInputChange}
                    placeholder="제목을 입력하세요"
                    required
                />
                <textarea
                    name="description"
                    value={post.description}
                    onChange={handleInputChange}
                    placeholder="설명을 입력하세요"
                    required
                />
                <div className="form-actions">
                    <button type="submit" className="save-button">저장</button>
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default EditPostPage;
