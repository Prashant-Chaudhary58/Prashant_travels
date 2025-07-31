import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import signupImage from "../assets/signupImage.png";
import signupImage from "../assets/Signup1.png";
import signupImage2 from "../assets/Signup2.png";
import TravelIcon from "../assets/logo.png";
import mailIcon from "../assets/icon/mail-142.png";
import eyeIcon from "../assets/icon/eye-12111.png";
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

const Login = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  
   const images = [
    signupImage,
    signupImage2,
    signupImage,
    signupImage2,
    signupImage,
    signupImage2,

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const validateForm = (data) => {
    const errors = {};
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate form
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/users/login', data);
      
      // Store user data securely
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Login successful!');
      navigate("/");
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(
        err.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans mx-12 gap-9 mr-7 ml-7 mt-4">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <img
          src={TravelIcon}
          alt="Travel Icon"
          className="absolute top-2 left-2 w-20 z-10"
        />
        <div className="w-full h-full relative">
          <img
            src={images[currentSlide]}
            alt="Slide"
            className="w-full h-full object-cover rounded-2xl transition-all duration-700"
          />
          <div className="absolute bottom-4 left-4 text-white text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
            Caption for Slide {currentSlide + 1}
          </div>
        </div>
      </div>
      <div className="flex-1 p-10 flex flex-col justify-center bg-white">
        <h2 className="text-3xl font-bold mb-4">Log into your account</h2>
        <div className="text-xl text-gray-600 mb-8 flex gap-2">
          <span className="font-bold text-black">Travel .</span> Explore · Stay ·
          Relax
        </div>
        {error && (
          <div className="w-full p-3 mb-4 text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}
        <form className="w-full mr-44" onSubmit={handleSubmit}>
          <div className="relative w-full mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-3 border-2 ${
                validationErrors.email ? 'border-red-500' : 'border-black'
              } rounded bg-gray-300`}
            />
            {validationErrors.email && (
              <div className="text-red-500 text-sm mt-1">
                {validationErrors.email}
              </div>
            )}
            <img
              src={mailIcon}
              alt="mail icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6"
            />
          </div>
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`w-full p-3 border-2 ${
                validationErrors.password ? 'border-red-500' : 'border-black'
              } rounded bg-gray-300`}
            />
            {validationErrors.password && (
              <div className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </div>
            )}
            <img
              src={eyeIcon}
              alt="eye icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="terms" name="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Agree to the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-indigo-600 text-white font-bold rounded 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up.
          </Link>
        </p>
        <button className="mt-4 w-52 p-3 border border-gray-400 rounded bg-white hover:bg-indigo-600 hover:text-white">
          <Link to="/" className="block w-full h-full text-center">
            Continue without login →
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Login;
