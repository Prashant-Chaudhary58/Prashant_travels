import { useState } from "react";
import { Link } from "react-router-dom";
import TravelIcon from "../assets/logo.png";
import ProfileModal from "./ProfileModel";

// eslint-disable-next-line react/prop-types
const ProfileNavbar = ({ userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!userData || !userData.user) {
    return <div>Loading...</div>;
  }

  const { user } = userData;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="bg-[#001A72] text-white flex items-center pt-0 pl-15">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex justify-around items-center px-20 py-4 bg-[#001A72] text-white z-50">
        <div className="flex items-center">
          <Link to="/">
            <img src={TravelIcon} alt="Travel Logo" className="h-10" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/addproperty" className="text-white">
            List your property
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#001A72] flex items-center justify-center font-bold text-xl">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container px-8 pt-0 pb-8 max-w-5xl mx-auto mt-20 bg-[#001A72]">
        <div className="w-32 h-32 rounded-full bg-white text-[#001A72] flex items-center justify-center font-bold text-5xl border-4 border-red-500">
          {getInitials(user.firstName, user.lastName)}
        </div>
        <h2 className="text-2xl font-bold mt-2">Hi, {`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-lg">{user.email}</p>
        <p className="text-sm text-gray-300">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        <button
          className="mt-2 px-4 py-1 bg-white text-[#001A72] rounded "
          onClick={() => setIsModalOpen(true)}
        >
          Edit profile
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
      />
    </div>
  );
};

export default ProfileNavbar;
