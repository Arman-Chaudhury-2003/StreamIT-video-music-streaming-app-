import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import videoApi from "../api/videoApi";

const WatchVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVideo = async () => {
    try {
      const res = await videoApi.get(`/${videoId}`);
      setVideo(res.data.data);

      // increment views
      await videoApi.post(`/${videoId}/views`);
    } catch (err) {
      console.error("Failed to load video", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  if (loading) return <div className="p-6">Loading video...</div>;

  if (!video) return <div className="p-6 text-red-500">Video not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <video
        src={video.videofile}
        controls
        className="w-full rounded-lg shadow-lg mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      <p className="text-sm text-gray-500">Views: {video.views}</p>
    </div>
  );
};

export default WatchVideo;
