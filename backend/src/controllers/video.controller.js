import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";

// Upload a new video
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublic } = req.body;

  const videoPath = req.files?.videofile?.[0]?.path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

  if (!title || !description || !videoPath || !thumbnailPath) {
    throw new ApiError(
      400,
      "All fields (title, description, video, thumbnail) are required"
    );
  }

  const uploadedVideo = await uploadOnCloudinary(videoPath, "video");
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath, "image");

  if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
    throw new ApiError(500, "Error uploading video or thumbnail");
  }

  const video = await Video.create({
    title,
    description,
    videofile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    duration: Math.floor(uploadedVideo.duration || 0),
    isPublic: isPublic === "true" || isPublic === true,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

// Get all public videos
const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ isPublic: true })
    .populate("owner", "username avatar fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Public videos fetched"));
});

// Get a single video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username avatar fullName"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details fetched"));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete this video");
  }

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// Get all videos uploaded by current user
const getMyVideos = asyncHandler(async (req, res) => {
  const myVideos = await Video.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, myVideos, "Your videos fetched successfully"));
});

// Increment view count
const incrementVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "View count updated"));
});

export {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  getMyVideos,
  incrementVideoViews,
};
