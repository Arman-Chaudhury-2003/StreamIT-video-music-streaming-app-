import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config.js";
import userRouter from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import subsRoutes from "./routes/subs.routes.js";
import likesRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
const app = express();
// console.log(likesRoutes)
//always use app.use for middleware functions
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }) //this is like cors er nijer obj ache jekhane origin set kora jabe and many more (CTRL+space for more commands)
);

app.use(express.json({ limit: "16kb" })); //json theke jokhon data asbe(like forms) otr limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url theke jokhon data asbe.
app.use(express.static("public")); //images and all
app.use(cookieParser()); //CRUD options on cookies given by users

//routes import

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/subscriptions", subsRoutes);
app.use("/api/v1/likes", likesRoutes);
app.use("/api/v1/comments", commentRoutes);

export { app };
