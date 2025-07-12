import axios from "axios";

const subApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/subscriptions",
  withCredentials: true,
});

export const subscribe = (channelId) => subApi.post(`/subscribe/${channelId}`);

export const unsubscribe = (channelId) =>
  subApi.post(`/unsubscribe/${channelId}`);

export const getSubscribedChannels = () => subApi.get("/subscribed-channels");

export const getSubscribers = (userId) => subApi.get(`/subscribers/${userId}`);

export const getSubscriptionStats = () => subApi.get("/stats");

export const getMySubscribers = () => subApi.get("/my-subscribers");
export const getMySubscribedChannels = () => subApi.get("/my-subscriptions");

export default subApi;
