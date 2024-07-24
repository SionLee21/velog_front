import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import bellIcon from '../assets/bell-icon.jpg';
import searchIcon from '../assets/search-icon.jpg';
import profilePic from '../assets/profile-pic.jpg';

const BasicHeader = ({ toggleProfileMenu, profileMenuOpen, profileRef, fetchTrendingPosts, fetchLatestPosts, selectedMenu, toggleSearch, searchTerm, setSearchTerm }) => (
    <div className="header-top">
        <Link to="/" className="header-title-link">
            <h1 className="header-title">velog</h1>
        </Link>
        <div className="header-icons">
            <img className="icon" src={bellIcon} alt="bell" />
            <img className="icon" src={searchIcon} alt="search" onClick={toggleSearch} />
            {searchTerm !== null && (
                <input
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요"
                />
            )}
            <Link to="/new" className="new-post-button">새 글 작성</Link>
            <div ref={profileRef} className="profile-container" onClick={toggleProfileMenu}>
                <img className="profile-pic" src={profilePic} alt="Profile" />
                <span className="dropdown-arrow">▼</span>
            </div>
            {profileMenuOpen && (
                <div className="profile-menu">
                    <span>내 벨로그</span>
                    <span>임시 글</span>
                    <span>읽기 목록</span>
                    <span className="active">설정</span>
                    <span>로그아웃</span>
                </div>
            )}
        </div>
    </div>
);

const ExtendedHeader = ({ toggleSortMenu, sortMenuOpen, sortRef, toggleThreeDotsMenu, threeDotsMenuOpen, threeDotsRef, setPosts, selectedRange, setSelectedRange, setSortMenuOpen, fetchTrendingPosts, fetchLatestPosts, selectedMenu }) => {
    const navigate = useNavigate();

    const fetchPostsByDateRange = async (startDate, endDate) => {
        try {
            const response = await axios.get('https://mumuk.store/api/posts/date-range', {
                params: { startDate, endDate }
            });
            setPosts(response.data);
            navigate('/');
        } catch (error) {
            console.error('Error fetching posts by date range:', error);
        }
    };

    const handleDateRangeClick = (range) => {
        const today = new Date();
        let startDate;
        let endDate = today.toISOString().split('T')[0];

        switch (range) {
            case 'today':
                startDate = endDate;
                setSelectedRange('오늘');
                break;
            case 'thisWeek':
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Monday as the first day of the week
                startDate = firstDayOfWeek.toISOString().split('T')[0];
                setSelectedRange('이번 주');
                break;
            case 'thisMonth':
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate = firstDayOfMonth.toISOString().split('T')[0];
                setSelectedRange('이번 달');
                break;
            case 'thisYear':
                const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
                startDate = firstDayOfYear.toISOString().split('T')[0];
                setSelectedRange('올해');
                break;
            default:
                startDate = endDate;
                setSelectedRange('오늘');
        }

        fetchPostsByDateRange(startDate, endDate);
        setSortMenuOpen(false);
    };

    return (
        <div className="header-menu-container">
            <div className="header-menu">
                <span className={`menu-item ${selectedMenu === 'trending' ? 'active' : ''}`} onClick={fetchTrendingPosts}>트렌딩</span>
                <span className={`menu-item ${selectedMenu === 'latest' ? 'active' : ''}`} onClick={fetchLatestPosts}>최신</span>
                <span className="menu-item">피드</span>
            </div>
            <div className="header-right">
                <button ref={sortRef} className="sort-button" onClick={(e) => { e.stopPropagation(); toggleSortMenu(); }}>
                    <span className="text">{selectedRange}</span>
                    <span className="dropdown-arrow">▼</span>
                </button>
                {sortMenuOpen && (
                    <div className="sort-menu" onClick={(e) => e.stopPropagation()}>
                        <span onClick={() => handleDateRangeClick('today')}>오늘</span>
                        <span onClick={() => handleDateRangeClick('thisWeek')}>이번 주</span>
                        <span onClick={() => handleDateRangeClick('thisMonth')}>이번 달</span>
                        <span onClick={() => handleDateRangeClick('thisYear')}>올해</span>
                    </div>
                )}
                <div ref={threeDotsRef} className="three-dots-container" onClick={(e) => { e.stopPropagation(); toggleThreeDotsMenu(); }}>
                    <span className="three-dots">⋮</span>
                </div>
                {threeDotsMenuOpen && (
                    <div className="three-dots-menu">
                        <span>공지사항</span>
                        <span>태그 목록</span>
                        <span>서비스 정책</span>
                        <span>Slack</span>
                        <span>문의<p>contact@velog.io</p></span>
                        <span>Powered by Stellate</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const Header = ({ showExtended, setPosts, setSearchTerm }) => {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [threeDotsMenuOpen, setThreeDotsMenuOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState('이번 주'); // Default selected range
    const [selectedMenu, setSelectedMenu] = useState('trending'); // Default selected menu
    const [searchTerm, setSearchTermState] = useState(''); // 검색어 상태

    const profileRef = useRef();
    const sortRef = useRef();
    const threeDotsRef = useRef();

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!profileMenuOpen);
        setSortMenuOpen(false);
        setThreeDotsMenuOpen(false);
    };

    const toggleSortMenu = () => {
        setSortMenuOpen(!sortMenuOpen);
        setProfileMenuOpen(false);
        setThreeDotsMenuOpen(false);
    };

    const toggleThreeDotsMenu = () => {
        setThreeDotsMenuOpen(!threeDotsMenuOpen);
        setProfileMenuOpen(false);
        setSortMenuOpen(false);
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setProfileMenuOpen(false);
        }
        if (threeDotsRef.current && !threeDotsRef.current.contains(event.target)) {
            setThreeDotsMenuOpen(false);
        }
    };

    const fetchTrendingPosts = async () => {
        try {
            const response = await axios.get('https://mumuk.store/api/posts/trending');
            setPosts(response.data);
            setSelectedMenu('trending');
        } catch (error) {
            console.error('Error fetching trending posts:', error);
        }
    };

    const fetchLatestPosts = async () => {
        try {
            const response = await axios.get('https://mumuk.store/api/posts/latest');
            setPosts(response.data);
            setSelectedMenu('latest');
        } catch (error) {
            console.error('Error fetching latest posts:', error);
        }
    };

    const toggleSearch = () => {
        if (searchTerm !== null) {
            setSearchTermState(null);
            setSearchTerm('');
        } else {
            setSearchTermState('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSearchTerm(searchTerm);
    }, [searchTerm]);

    return (
        <header className="header">
            <BasicHeader
                toggleProfileMenu={toggleProfileMenu}
                profileMenuOpen={profileMenuOpen}
                profileRef={profileRef}
                fetchTrendingPosts={fetchTrendingPosts}
                fetchLatestPosts={fetchLatestPosts}
                selectedMenu={selectedMenu}
                toggleSearch={toggleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTermState}
            />
            {showExtended && (
                <ExtendedHeader
                    toggleSortMenu={toggleSortMenu}
                    sortMenuOpen={sortMenuOpen}
                    sortRef={sortRef}
                    toggleThreeDotsMenu={toggleThreeDotsMenu}
                    threeDotsMenuOpen={threeDotsMenuOpen}
                    threeDotsRef={threeDotsRef}
                    setPosts={setPosts}
                    selectedRange={selectedRange}
                    setSelectedRange={setSelectedRange}
                    setSortMenuOpen={setSortMenuOpen}
                    fetchTrendingPosts={fetchTrendingPosts}
                    fetchLatestPosts={fetchLatestPosts}
                    selectedMenu={selectedMenu}
                />
            )}
        </header>
    );
};

export default Header;
