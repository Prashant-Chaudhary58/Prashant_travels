import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TravelIcon from "../assets/logo.png";
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user data in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLinkClick = (e, linkName) => {
    e.preventDefault();
    console.log("Link", linkName, "clicked");
    
    setSelectedLink(linkName);
    navigate("/")
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <>
      <div className="flex fixed top-0 left-0 w-full bg-[#5a75cd] text-white z-50">
        <div className="container mx-auto">
          {/* Top Navbar */}
          <div className="flex justify-around items-center px-4 py-4">
            {/* Left Side: Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img src={TravelIcon} alt="Travel Logo" className="h-10" />
              </Link>
            </div>

            {/* Right Side: Auth Links or User Avatar */}
            <div className="flex items-center space-x-4">
              <Link to="/addPackage" className="text-white">
                List your Packages
              </Link>
              
              {user && (
                <Link to="/notifications" className="text-white relative">
                  <FaBell className="text-2xl hover:text-blue-200 transition-colors" />
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Link to="/profile" className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-white text-[#001A72] flex items-center justify-center font-bold cursor-pointer">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                    </Link>
                    <div className="ml-3 text-white">
                      <div className="font-semibold">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/SignUp"
                    className="bg-white text-[#001A72] px-4 py-1 rounded"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-[#001A72] px-4 py-1 rounded"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Bottom Navbar: Navigation Links */}
          <div className="flex container px-8 gap-4 py-6 max-w-5xl mx-auto">
            <Link
              to="/"
              className={`border-2 border-white px-6 py-2 rounded-full transition-colors ${
                selectedLink === "Home"
                  ? "bg-white text-[#001A72]"
                  : "text-white"
              }`}
              onClick={(e) => handleLinkClick(e, "Home")}
            >
              Home
            </Link>
            <Link
              to="/notFound"
              className={`border-2 border-white px-6 py-2 rounded-full transition-colors ${
                selectedLink === "Trending"
                  ? "bg-white text-[#001A72]"
                  : "text-white"
              }`}
              onClick={(e) => handleLinkClick(e, "Trending")}
            >
              Trending Countries
            </Link>
            <Link
              to="/notFound"
              className={`border-2 border-white px-6 py-2 rounded-full transition-colors ${
                selectedLink === "packages"
                  ? "bg-white text-[#001A72]"
                  : "text-white"
              }`}
              onClick={(e) => handleLinkClick(e, "packages")}
            >
              Trending packages
            </Link>
            <Link
              to="/notFound"
              className={`border-2 border-white px-6 py-2 rounded-full transition-colors ${
                selectedLink === "Premium"
                  ? "bg-white text-[#001A72]"
                  : "text-white"
              }`}
              onClick={(e) => handleLinkClick(e, "Premium")}
            >
              Solo Travel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
