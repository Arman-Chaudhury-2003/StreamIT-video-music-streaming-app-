import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import videoApi from "../api/videoApi";
import {
  likeVideo,
  dislikeVideo,
  removeReaction,
  getReactionCounts,
  checkUserReaction,
} from "../api/likeApi";
import {
  addComment as addCommentApi,
  deleteComment as deleteCommentApi,
} from "../api/commentApi";
import {
  fetchComments,
  addNewComment,
  removeComment,
  clearComments,
} from "../slices/commentSlice";

//sob states
const WatchVideo = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });
  const [reaction, setReaction] = useState(null);
  const [newComment, setNewComment] = useState("");

  const comments = useSelector((state) => state.comments);

  const fetchVideo = async () => {
    const res = await videoApi.get(`/${videoId}`);
    setVideo(res.data.data);
  };

  const fetchReactions = async () => {
    const cnts = await getReactionCounts(videoId);
    const rep = await checkUserReaction(videoId).catch(() => ({
      data: { data: { type: null } },
    }));
    setCounts(cnts.data.data);
    setReaction(rep.data.data.type);
  };

  const handleLike = async () => {
    if (reaction === "like") await removeReaction(videoId);
    else await likeVideo(videoId);
    await fetchReactions();
  };

  const handleDislike = async () => {
    if (reaction === "dislike") await removeReaction(videoId);
    else await dislikeVideo(videoId);
    await fetchReactions();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const res = await addCommentApi(videoId, newComment);
    dispatch(addNewComment(res.data.data));
    setNewComment("");
  };

  const handleDeleteComment = async (id) => {
    await deleteCommentApi(id);
    dispatch(removeComment(id));
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await fetchVideo();
        await fetchReactions();
        await dispatch(fetchComments(videoId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
    return () => dispatch(clearComments());
  }, [videoId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found.</div>;
  // console.log(comments);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <video
        src={video.videofile}
        controls
        className="w-full rounded-lg mb-4"
      />
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleLike}
          className={reaction === "like" ? "text-blue-600" : "text-gray-600"}
        >
          👍 {counts.likes}
        </button>
        <button
          onClick={handleDislike}
          className={reaction === "dislike" ? "text-red-600" : "text-gray-600"}
        >
          👎 {counts.dislikes}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-1">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      <p className="text-sm text-gray-500">Views: {video.views}</p>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Comments</h2>
        <div className="flex gap-2 mb-4">
          <textarea
            className="flex-1 border p-2 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button
            onClick={handleAddComment}
            className="px-4 bg-blue-600 text-white rounded"
          >
            Post
          </button>
        </div>

        {comments.items.length === 0 && (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        )}
        {comments.items.map((c) => (
          <div key={c._id} className="border-b py-2">
            <div className="flex justify-between">
              <div className="font-semibold">{c.user.username}</div>
              {c.user._id === video.owner._id && (
                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDeleteComment(c._id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p>{c.content}</p>
            <div className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WatchVideo;
