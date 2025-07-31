import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ensure Link and useNavigate are imported
import signupImage from "../assets/Signup1.png";
import signupImage2 from "../assets/Signup2.png";
import TravelIcon from "../assets/logo.png";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios with better error handling
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data
    });
    return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', {
            message: error.message,
            response: error.response,
            request: error.request,
            config: error.config
        });
        return Promise.reject(error);
    }
);

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const Signup = () => {
    const images = [
    signupImage,
    signupImage2,
    signupImage,
    signupImage2,
    signupImage,
    signupImage2,

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (!data.email?.includes('@')) errors.email = 'Please enter a valid email';
    if (!data.password) errors.password = 'Password is required';
    if (!passwordRegex.test(data.password)) {
      errors.password = 'Password must be at least 6 characters with letters and numbers';
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate form
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Changed from /signup to /register to match backend
      const response = await api.post('/users/register', data);
      console.log('Signup successful:', response.data);
      if (response.data.success) {
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(response.data.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error(
        err.response?.data?.error || 
        err.response?.data?.details?.[0] ||
        'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen m-5 font-sans mx-12 gap-6">
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
      {/* Left Container */}
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <img
          src={TravelIcon}
          alt="Travel Icon"
          className="absolute top-2 left-2 w-20 h-auto z-10"
        />
        <div
          className="flex w-full h-full transition-transform ease-in-out duration-1000"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 text-white text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                Caption for Slide {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Container */}
      <div className="flex-1 p-10 flex flex-col justify-center items-start bg-white">
        <h2 className="text-4xl font-bold mb-4">Create an account</h2>
        <div className="flex gap-2 text-gray-500 mb-6 text-xl">
          <div className="font-bold text-black">Travel .</div>
          <div>Explore · Stay · Relax</div>
        </div>
        {error && (
          <div className="w-full p-3 mb-4 text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className={`w-full p-3 border-2 ${
                validationErrors.firstName ? 'border-red-500' : 'border-black'
              } rounded bg-gray-300 mb-4`}
            />
            {validationErrors.firstName && (
              <div className="text-red-500 text-sm mb-2">
                {validationErrors.firstName}
              </div>
            )}
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className={`w-full p-3 border-2 ${
                validationErrors.lastName ? 'border-red-500' : 'border-black'
              } rounded bg-gray-300 mb-4`}
            />
            {validationErrors.lastName && (
              <div className="text-red-500 text-sm mb-2">
                {validationErrors.lastName}
              </div>
            )}
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-3 border-2 ${
              validationErrors.email ? 'border-red-500' : 'border-black'
            } rounded bg-gray-300 mb-4`}
          />
          {validationErrors.email && (
            <div className="text-red-500 text-sm mb-2">
              {validationErrors.email}
            </div>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full p-3 border-2 ${
              validationErrors.password ? 'border-red-500' : 'border-black'
            } rounded bg-gray-300 mb-4`}
          />
          {validationErrors.password && (
            <div className="text-red-500 text-sm mb-2">
              {validationErrors.password}
            </div>
          )}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className={`w-full p-3 border-2 ${
              validationErrors.confirmPassword ? 'border-red-500' : 'border-black'
            } rounded bg-gray-300 mb-4`}
          />
          {validationErrors.confirmPassword && (
            <div className="text-red-500 text-sm mb-2">
              {validationErrors.confirmPassword}
            </div>
          )}
          <div className="flex items-center mb-4">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              Agree to the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-indigo-600 text-white font-bold rounded 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            {isLoading ? 'Creating Account...' : 'Signup'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in.
          </Link>
        </p>
        <button className="mt-4 w-55 p-3 border border-gray-400 rounded bg-white hover:bg-indigo-600 hover:text-white">
          <Link to="/" className="block w-full h-full text-center">
            Continue without Signup →
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Signup;
