import { Like } from "../models/like.model.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/APIResponse.js";
import mongoose from "mongoose";

// Helper to validate ObjectIds
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Like a video
const likeVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const existing = await Like.findOne({ video: videoId, user: userId });

  if (existing && existing.type === "like") {
    return res.status(200).json(new ApiResponse(200, {}, "Already liked"));
  }

  if (existing && existing.type === "dislike") {
    existing.type = "like";
    await existing.save();
    return res
      .status(200)
      .json(new ApiResponse(200, existing, "Changed dislike to like"));
  }

  const like = await Like.create({
    video: videoId,
    user: userId,
    type: "like",
  });
  return res.status(201).json(new ApiResponse(201, like, "Video liked"));
});

// Dislike a video
const dislikeVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const existing = await Like.findOne({ video: videoId, user: userId });

  if (existing && existing.type === "dislike") {
    return res.status(200).json(new ApiResponse(200, {}, "Already disliked"));
  }

  if (existing && existing.type === "like") {
    existing.type = "dislike";
    await existing.save();
    return res
      .status(200)
      .json(new ApiResponse(200, existing, "Changed like to dislike"));
  }

  const dislike = await Like.create({
    video: videoId,
    user: userId,
    type: "dislike",
  });
  return res.status(201).json(new ApiResponse(201, dislike, "Video disliked"));
});

// Remove like/dislike
const removeReaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const deleted = await Like.findOneAndDelete({ video: videoId, user: userId });

  if (!deleted) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No reaction to remove"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Reaction removed"));
});

// Get like/dislike counts
const getReactionCounts = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const [likes, dislikes] = await Promise.all([
    Like.countDocuments({ video: videoId, type: "like" }),
    Like.countDocuments({ video: videoId, type: "dislike" }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { likes, dislikes }, "Reaction counts fetched"));
});

// Check if user liked/disliked a video
const getUserReaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const reaction = await Like.findOne({ video: videoId, user: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { type: reaction?.type || null },
        "User reaction fetched"
      )
    );
});

export {
  likeVideo,
  dislikeVideo,
  removeReaction,
  getReactionCounts,
  getUserReaction,
  
};
