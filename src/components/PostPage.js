import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostPage.css';

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [previousPost, setPreviousPost] = useState(null);
    const [nextPost, setNextPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareMessage, setShareMessage] = useState('');

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

        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://mumuk.store/api/posts/${postId}/comments`);
                setComments(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchPreviousPost = async () => {
            try {
                const response = await axios.get(`https://mumuk.store/api/posts/${postId}/previous`);
                setPreviousPost(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchNextPost = async () => {
            try {
                const response = await axios.get(`https://mumuk.store/api/posts/${postId}/next`);
                setNextPost(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPost();
        fetchComments();
        fetchPreviousPost();
        fetchNextPost();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://mumuk.store/api/posts/${postId}/comments`, { content: newComment });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShareClick = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            setShareMessage('링크가 복사되었습니다!');
            setTimeout(() => setShareMessage(''), 2000); // 2초 후에 메시지 지우기
        }).catch(err => {
            setError('링크 복사에 실패했습니다.');
        });
    };

    const handleLikeClick = async () => {
        try {
            const response = await axios.post(`https://mumuk.store/api/posts/${postId}/like`);
            setPost({ ...post, likes: response.data.likes });
        } catch (err) {
            setError('좋아요를 할 수 없습니다.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`https://mumuk.store/api/posts/${postId}`);
                navigate('/');
            } catch (err) {
                setError('게시물을 삭제할 수 없습니다.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${postId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="post-page">
            <header className="post-header">
                <div className="post-header-content">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span>{post.author}</span> · <span>{post.date}</span>
                    </div>
                </div>
            </header>
            <div className="post-content">
                <p className="post-description">{post.description}</p>
                <p>{post.content}</p>
            </div>
            <div className="post-footer">
                <div className="post-actions">
                    <button className="like-button" onClick={handleLikeClick}>❤️ {post.likes}</button>
                    <button className="share-button" onClick={handleShareClick}>🔗 공유</button>
                    <button className="edit-button" onClick={handleEdit}>수정</button>
                    <button className="delete-button" onClick={handleDelete}>삭제</button>
                </div>
                {shareMessage && <div className="share-message">{shareMessage}</div>}
            </div>
            <nav className="post-navigation">
                {previousPost && <Link to={`/post/${previousPost.id}`} className="nav-button">이전 포스트</Link>}
                {nextPost && <Link to={`/post/${nextPost.id}`} className="nav-button">다음 포스트</Link>}
            </nav>
            <section className="comments-section">
                <h3>{comments.length}개의 댓글</h3>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성하세요"
                        required
                    />
                    <button type="submit">댓글 작성</button>
                </form>
                <div className="comments-list">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PostPage;
