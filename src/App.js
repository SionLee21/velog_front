import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NewPostPage from './components/NewPostPage';
import PostPage from './components/PostPage';
import EditPostPage from './components/EditPostPage';
import './App.css';

function App() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const isPostPage = location.pathname.startsWith('/post/');
    const isEditPostPage = location.pathname.startsWith('/edit/');
    const showHeader = location.pathname !== '/new';


    return (
        <div className="App">
            {showHeader && <Header showExtended={!isPostPage && !isEditPostPage}  setPosts={setPosts} setSearchTerm={setSearchTerm} />}
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
