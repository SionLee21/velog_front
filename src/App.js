import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NewPostPage from './components/NewPostPage';
import PostPage from './components/PostPage';
import EditPostPage from './components/EditPostPage';
import axios from 'axios';
import './App.css';

function App() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const isPostPage = location.pathname.startsWith('/post/');
    const showHeader = location.pathname !== '/new';

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                const response = await axios.get('https://mumuk.store/api/posts/trending');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching trending posts:', error);
            }
        };

        fetchTrendingPosts();
    }, []);

    return (
        <div className="App">
            {showHeader && <Header showExtended={!isPostPage} setPosts={setPosts} setSearchTerm={setSearchTerm} />}
            <Routes>
                <Route path="/" element={<HomePage posts={posts} searchTerm={searchTerm} />} />
                <Route path="/new" element={<NewPostPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/edit/:postId" element={<EditPostPage />} />
            </Routes>
        </div>
    );
}

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
