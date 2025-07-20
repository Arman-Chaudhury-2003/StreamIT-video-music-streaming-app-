import { Router } from "express";
import {
  addComment,
  deleteComment,
  getCommentsForVideo,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add/:videoId", verifyJWT, addComment);
router.delete("/delete/:commentId", verifyJWT, deleteComment);
router.get("/video/:videoId", getCommentsForVideo);

export default router;
