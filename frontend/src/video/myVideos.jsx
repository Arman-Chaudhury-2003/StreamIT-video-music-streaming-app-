import React, { useEffect, useState } from "react";
import videoApi from "../api/videoApi";
import VideoCard from "../components/videoCard";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVideos = async () => {
    try {
      const res = await videoApi.get("/me");
      setVideos(res.data.data || []);
    } catch (error) {
      console.error("Error fetching your videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await videoApi.delete(`/${videoId}`);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Failed to delete video", err);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Uploaded Videos</h2>
      {loading ? (
        <p className="text-gray-500">Loading your videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-500">You have not uploaded any videos yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              showDelete={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVideos;
