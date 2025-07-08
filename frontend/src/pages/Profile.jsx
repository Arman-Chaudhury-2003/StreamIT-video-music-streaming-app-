import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/current-user");
      setUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await api.post("/update-details", {
        fullName: editForm.fullName,
        email: editForm.email,
      });

      if (newAvatar) {
        const avatarForm = new FormData();
        avatarForm.append("avatar", newAvatar);
        await api.post("/avatar", avatarForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (newCoverImage) {
        const coverForm = new FormData();
        coverForm.append("coverImage", newCoverImage);
        await api.post("/coverImage", coverForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!user)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load profile.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      {newCoverImage ? (
        <img
          src={URL.createObjectURL(newCoverImage)}
          alt="Cover Preview"
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      ) : (
        user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
        )
      )}

      <div className="flex items-center space-x-4">
        <img
          src={newAvatar ? URL.createObjectURL(newAvatar) : user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <div className="flex-1">
          {editing ? (
            <>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                placeholder="Full Name"
                className="block w-full p-2 mt-1 border rounded-lg"
              />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email"
                className="block w-full p-2 mt-2 border rounded-lg"
              />

              <div className="mt-3">
                <label className="block text-sm font-medium">
                  Change Avatar:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAvatar(e.target.files[0])}
                  className="mt-1"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium">
                  Change Cover Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCoverImage(e.target.files[0])}
                  className="mt-1"
                />
              </div>

              <div className="mt-4 space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-700 mt-1">{user.email}</p>
              <button
                onClick={handleEdit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
