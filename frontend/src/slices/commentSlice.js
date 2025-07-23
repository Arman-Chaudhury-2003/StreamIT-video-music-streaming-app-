import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVideoComments, addComment, deleteComment } from "../api/commentApi";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (videoId) => {
    const res = await getVideoComments(videoId);
    return res.data.data;
  }
);

export const addNewComment = createAsyncThunk(
  "comments/addNewComment",
  async ({ videoId, content }) => {
    await addComment(videoId, content);
    const res = await getVideoComments(videoId); // refetch
    return res.data.data;
  }
);

export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async ({ videoId, commentId }) => {
    await deleteComment(commentId);
    const res = await getVideoComments(videoId); // refetch
    return res.data.data;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearComments(state) {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewComment.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
