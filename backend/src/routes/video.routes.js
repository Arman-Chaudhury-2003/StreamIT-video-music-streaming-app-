import { Router } from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  getMyVideos,
  incrementVideoViews,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Upload a video (requires login)
router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "videofile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

// Fetch all public videos
router.route("/").get(getAllVideos);

// Fetch logged-in user's videos
router.route("/me").get(verifyJWT, getMyVideos);

// Increment video views
router.route("/:videoId/views").post(incrementVideoViews);

// Get single video
router.route("/:videoId").get(getVideoById);

// Delete video (only by owner)
router.route("/:videoId").delete(verifyJWT, deleteVideo);

export default router;
