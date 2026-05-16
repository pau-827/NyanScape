import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({ baseURL: API_URL })

// Auth
export const signup = (data) => api.post('/api/auth/signup', data)
export const login = (data) => api.post('/api/auth/login', data)
export const logout = () => api.post('/api/auth/logout')

// Posts
export const getPosts = () => api.get('/api/posts/')
export const createPost = (formData) => api.post('/api/posts/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const deletePost = (postId) => api.delete(`/api/posts/${postId}`)

// Likes
export const likePost = (data) => api.post('/api/likes/', data)
export const unlikePost = (data) => api.delete('/api/likes/', { data })
export const getLikes = (postId) => api.get(`/api/likes/${postId}`)

// Comments
export const getComments = (postId) => api.get(`/api/comments/${postId}`)
export const addComment = (data) => api.post('/api/comments/', data)
export const deleteComment = (commentId) => api.delete(`/api/comments/${commentId}`)

// Profile
export const getProfile = (userId) => api.get(`/api/profile/${userId}`)
export const updateProfile = (data) => api.post('/api/profile/update', data)
export const uploadAvatar = (formData) => api.post('/api/profile/upload-avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
