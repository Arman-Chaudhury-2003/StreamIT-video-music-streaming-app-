import React, { useEffect, useState } from "react";
import { getPublicVideos } from "../api/videoApi";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await getPublicVideos();
        setVideos(data?.data || []);
      } catch (error) {
        console.error("Error fetching public videos", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Public Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => {
          console.log("Video ID being linked:", video._id); // 🛠 Debug log

          return (
            <Link key={video._id} to={`/watch/${video._id}`}>
              <div className="bg-gray-100 rounded shadow p-2 hover:shadow-md">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-2">
                  <p className="text-lg font-semibold">{video.title}</p>
                  <p className="text-sm text-gray-600">
                    {video.owner?.username} &bull; {video.views} views
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
