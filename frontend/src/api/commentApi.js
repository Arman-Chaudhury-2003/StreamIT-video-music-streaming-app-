import axios from "axios";

const commentApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/comments",
  withCredentials: true,
});

// Add a new comment
export const addComment = (videoId, content) =>
  commentApi.post(`/${videoId}`, { content });

// Get all comments for a video
export const getVideoComments = (videoId) =>
  commentApi.get(`/video/${videoId}`);

// Delete a comment
export const deleteComment = (commentId) =>
  commentApi.delete(`/delete/${commentId}`);

export default commentApi;
