import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  likeVideo,
  dislikeVideo,
  removeReaction,
  checkUserReaction,
  getReactionCounts,
} from "../api/likeApi";

export const fetchReactionCounts = createAsyncThunk(
  "like/fetchReactionCounts",
  async (videoId) => {
    const { data } = await getReactionCounts(videoId);
    return data;
  }
);

export const fetchUserReaction = createAsyncThunk(
  "like/fetchUserReaction",
  async (videoId) => {
    const { data } = await checkUserReaction(videoId);
    return data?.reaction;
  }
);

export const reactLike = createAsyncThunk("like/reactLike", async (videoId) => {
  const { data } = await likeVideo(videoId);
  return data;
});

export const reactDislike = createAsyncThunk(
  "like/reactDislike",
  async (videoId) => {
    const { data } = await dislikeVideo(videoId);
    return data;
  }
);

export const removeUserReaction = createAsyncThunk(
  "like/removeUserReaction",
  async (videoId) => {
    const { data } = await removeReaction(videoId);
    return data;
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likes: 0,
    dislikes: 0,
    userReaction: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReactionCounts.fulfilled, (state, action) => {
        state.likes = action.payload.likes;
        state.dislikes = action.payload.dislikes;
      })
      .addCase(fetchUserReaction.fulfilled, (state, action) => {
        state.userReaction = action.payload;
      })
      .addCase(reactLike.fulfilled, (state) => {
        state.userReaction = "like";
        state.likes++;
        if (state.userReaction === "dislike") state.dislikes--;
      })
      .addCase(reactDislike.fulfilled, (state) => {
        state.userReaction = "dislike";
        state.dislikes++;
        if (state.userReaction === "like") state.likes--;
      })
      .addCase(removeUserReaction.fulfilled, (state) => {
        if (state.userReaction === "like") state.likes--;
        if (state.userReaction === "dislike") state.dislikes--;
        state.userReaction = null;
      });
  },
});

export default likeSlice.reducer;
