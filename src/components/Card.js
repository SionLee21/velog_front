import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({ id, title, description, date, author, likes, comments, profilePic }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/post/${id}`);
    };

    return (
        <div className="card" onClick={handleClick}>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>
            <div className="card-date-comments">
                <span className="card-date">{date}</span>·
                <span className="card-comments">{comments}개의 댓글</span>
            </div>
            <div className="card-divider"></div>
            <div className="card-footer">
                <div className="card-author-info">
                    <img className="author-profile-pic" src={profilePic} alt="Profile" />
                    <span className="card-author">by {author}</span>
                </div>
                <div className="card-interactions">
                    <span className="card-likes">❤️ {likes}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
