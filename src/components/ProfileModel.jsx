import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const EditProfileModal = ({ isOpen, onClose, userData }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfileImage] = useState("../assets/Profile.jpeg");

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
    }
  }, [userData]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const result = await response.json();
      alert('Profile updated successfully!');
      onClose();
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
        <h2 className="text-center text-black text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center">
          <label htmlFor="profileImageUpload" className="cursor-pointer">
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-red-500 mb-2"
            />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-600">Click to change image</p>
        </div>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="First Name"
              className="border text-black p-2 rounded w-1/2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border text-black p-2 rounded w-1/2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="border text-black p-2 rounded w-full mt-2"
            value={email}
            disabled
          />
          <hr className="my-4" />
          <p className="text-red-500 font-bold">Change Password</p>
          <input
            type="password"
            placeholder="Old Password"
            className="border text-black p-2 rounded w-full mt-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="border text-black p-2 rounded w-full mt-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border text-black p-2 rounded w-full mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;