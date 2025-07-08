import { useState } from "react";
import api from "../api/axios";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword) {
      return alert("Please fill in both fields.");
    }
    if (formData.newPassword.length < 8) {
      return alert("New password must be at least 8 characters.");
    }

    try {
      setLoading(true);
      await api.post("/change-password", formData);
      alert("Password changed successfully.");
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium">
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-lg"
            placeholder="Enter your current password"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-lg"
            placeholder="Enter your new password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
