import React, { useEffect, useState } from "react";
import videoApi from "../api/videoApi";
import VideoCard from "../components/videoCard";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVideos = async () => {
    try {
      const res = await videoApi.get("/videos/my-videos");
      setVideos(res.data.data || []);
    } catch (error) {
      console.error("Error fetching your videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Uploaded Videos</h2>
      {loading ? (
        <p>Loading your videos...</p>
      ) : videos.length === 0 ? (
        <p>You have not uploaded any videos yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVideos;
