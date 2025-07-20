import { Router } from "express";
import {
  likeVideo,
  dislikeVideo,
  removeReaction,
  getReactionCounts,
  getUserReaction,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Like a video
router.route("/like/:videoId").post(verifyJWT, likeVideo);

// Dislike a video
router.route("/dislike/:videoId").post(verifyJWT, dislikeVideo);

router.route("/undislike/:videoId").delete(verifyJWT, removeReaction);

//
router.route("/:videoId/reactions").get(getReactionCounts);

// Check if user has liked/disliked a video
router.route("/reaction/:videoId").get(verifyJWT, getUserReaction);

export default router;
