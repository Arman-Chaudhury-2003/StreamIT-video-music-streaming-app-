import axios from "axios";

const likeApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/likes",
  withCredentials: true,
});

// Like a video
export const likeVideo = (videoId) => likeApi.post(`/like/${videoId}`);

// Dislike a video
export const dislikeVideo = (videoId) => likeApi.post(`/dislike/${videoId}`);

// Remove reaction
export const removeReaction = (videoId) => likeApi.delete(`/remove/${videoId}`);

// Check if user liked/disliked a video
export const checkUserReaction = (videoId) => likeApi.get(`/check/${videoId}`);

// Get like/dislike counts
export const getReactionCounts = (videoId) => likeApi.get(`/counts/${videoId}`);

export default likeApi;
