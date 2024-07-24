import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mumuk.store/api',
});

export const fetchPosts = () => api.get('/posts');
export const fetchPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (post) => api.post('/posts', post);
