import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />

          {/* isPublic badge */}
          <span
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-semibold ${
              video.isPublic
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {video.isPublic ? "Public" : "Private"}
          </span>
        </div>

        <div className="p-3">
          <h3 className="text-lg font-semibold truncate">{video.title}</h3>
          <p className="text-sm text-gray-600">
            {video?.owner?.username || "Unknown"} • {video.views} views
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
