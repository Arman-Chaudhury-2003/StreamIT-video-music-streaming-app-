import React, { useState } from "react";
import { uploadVideo } from "../api/video";

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("videoFile", formData.videoFile);
    data.append("thumbnail", formData.thumbnail);

    try {
      await uploadVideo(data);
      alert("Video uploaded successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) =>
          setFormData({ ...formData, videoFile: e.target.files[0] })
        }
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({ ...formData, thumbnail: e.target.files[0] })
        }
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadVideo;
