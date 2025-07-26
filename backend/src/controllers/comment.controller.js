import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /add/:videoId
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Comment content is required");

  const comment = await Comment.create({
    content,
    video: videoId,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});
// DELETE /delete/:commentId
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  
  const comment = await Comment.findById(commentId);
  console.log(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// GET /video/:videoId
const getCommentsForVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ video: videoId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Fetched comments successfully"));
});
export { getCommentsForVideo, deleteComment, addComment };
