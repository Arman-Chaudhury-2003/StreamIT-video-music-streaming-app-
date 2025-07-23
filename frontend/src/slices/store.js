import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "./commentSlice";
import likeReducer from "./likeSlice";

const store = configureStore({
  reducer: {
    likes: likeReducer,
    comments: commentReducer,
  },
});

export default store;
