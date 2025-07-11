import axios from "axios";

const videoApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/videos",
  withCredentials: true,
});

export const getPublicVideos = () => videoApi.get("/");

export default videoApi;
