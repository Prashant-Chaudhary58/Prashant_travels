import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import homeIcon from "../assets/addprop/home.png";
import podsIcon from "../assets/addprop/pods.png";
import smallHotelIcon from "../assets/addprop/smallHotel.png";
import hotelIcon from "../assets/addprop/hotel.png";
import Navbar from "../components/NavbarB";
import {
  Bath,
  Car,
  Utensils,
  Wifi,
  Coffee,
  Baby,
  CheckCircle,
} from "lucide-react";

const AddPropertyForm = () => {
  const [activeType, setActiveType] = useState("Hotels");
  const [offerings, setOfferings] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTypeCardClick = (typeName) => {
    setActiveType(typeName);
  };

  const handleOfferClick = (e, offerName) => {
    e.preventDefault(); // Prevent form submission
    if (offerings.includes(offerName)) {
      setOfferings(offerings.filter((offer) => offer !== offerName));
    } else {
      setOfferings([...offerings, offerName]);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    // Preview first image
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formData = new FormData();
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login first');
            return;
        }

        // Get form values
        const title = e.target.title.value.trim();
        const description = e.target.description.value.trim();
        const location = e.target.location.value.trim();
        const price = e.target.price.value.trim();

        // Validate fields
        if (!title || !description || !location || !price) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!selectedFiles.length) {
            toast.error('Please select at least one image');
            return;
        }

        // Append form data
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("price", price);
        formData.append("property_type", activeType);
        formData.append("facilities", JSON.stringify(offerings));

        // Append images
        selectedFiles.forEach((file) => {
            formData.append("images", file);
        });

        console.log('Submitting property data...');

        const response = await fetch("http://localhost:5000/properties/registerProperty", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to upload property');
        }

        console.log('Success:', responseData);
        toast.success("Property uploaded successfully!");
        
        // Reset form
        e.target.reset();
        setImagePreview(null);
        setSelectedFiles([]);
        setOfferings([]);
        
    } catch (error) {
        console.error("Upload error:", error);
        toast.error(error.message || "Failed to upload property");
    } finally {
        setLoading(false);
    }
};

  const offeringIcons = {
    "Family stay": <CheckCircle size={20} />,
    Parking: <Car size={20} />,
    "Hot bathtub": <Bath size={20} />,
    "Taxi service": <Car size={20} />,
    "Dinner accommodation": <Utensils size={20} />,
    WiFi: <Wifi size={20} />,
    "Child environment": <Baby size={20} />,
    "Tea / Coffee": <Coffee size={20} />,
    "Good food": <Utensils size={20} />,
  };

  return (
    <>
      <Navbar />
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

      <div className="container px-8 py-8 max-w-5xl mx-auto mt-35">
        <h2 className="text-3xl font-bold mb-4">List your property .</h2>
        <p id="normal" className="text-lg text-gray-700 mb-8">
          Select your Property Type .
        </p>

        {/* Property Types */}
        <div className="property-type flex justify-between gap-4 mb-8">
          <div
            className={`type-card w-64 flex flex-col items-center py-8 px-6 border-2 border-gray-300 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
              activeType === "Homestay"
                ? "border-indigo-500"
                : "hover:border-gray-400"
            }`}
            onClick={() => handleTypeCardClick("Homestay")}
          >
            <img src={homeIcon} alt="Homestay" className="w-16 h-16 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Homestay</p>
          </div>
          <div
            className={`type-card w-64 flex flex-col items-center py-8 px-6 border-2 border-gray-300 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
              activeType === "Pods"
                ? "border-indigo-500"
                : "hover:border-gray-400"
            }`}
            onClick={() => handleTypeCardClick("Pods")}
          >
            <img src={podsIcon} alt="Pod" className="w-16 h-16 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Pods</p>
          </div>
          <div
            className={`type-card w-64 flex flex-col items-center py-8 px-6 border-2 border-gray-300 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
              activeType === "Hotels"
                ? "border-indigo-500"
                : "hover:border-gray-400"
            } active:border-indigo-500`}
            onClick={() => handleTypeCardClick("Hotels")}
          >
            <img src={smallHotelIcon} alt="Hotel" className="w-16 h-16 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Hotels</p>
          </div>
          <div
            className={`type-card w-64 flex flex-col items-center py-8 px-6 border-2 border-gray-300 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
              activeType === "Premium"
                ? "border-indigo-500"
                : "hover:border-gray-400"
            }`}
            onClick={() => handleTypeCardClick("Premium")}
          >
            <img src={hotelIcon} alt="Premium" className="w-16 h-16 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Premium</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="form-container flex gap-8 items-start">
          {/* Upload Box */}
          <div className="upload-box w-72 h-64 border-2 border-dashed border-gray-500 rounded-lg flex justify-center items-center cursor-pointer overflow-hidden">
            <label
              htmlFor="property-photo"
              className="cursor-pointer text-gray-600 text-5xl"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Property Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "+"
              )}
            </label>
            <input
              type="file"
              id="property-photo"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Property Form */}
          <form
            onSubmit={handleSubmit}
            className="property-form flex-1 flex flex-col gap-3"
          >
            <input
              name="title"
              type="text"
              placeholder="Property name"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              required
            />
            <input
              name="location"
              type="text"
              placeholder="Location"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            />
            <textarea
              name="description"
              placeholder="Description"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 resize-y min-h-[120px]"
            ></textarea>
            <p className="text-gray-700 font-semibold">Select Your Offerings</p>
            {/* Offerings */}
            <div className="offerings flex flex-wrap gap-2">
              {Object.keys(offeringIcons).map((offerName) => (
                <button
                  key={offerName}
                  type="button" // Add this to prevent form submission
                  className={`offer flex items-center gap-2 bg-gray-200 text-gray-700 border-none py-2 px-4 rounded-md cursor-pointer text-sm transition-colors duration-300 ${
                    offerings.includes(offerName)
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={(e) => handleOfferClick(e, offerName)}
                >
                  {offeringIcons[offerName]} {/* Render Icon Here */}
                  {offerName}
                </button>
              ))}
            </div>

            <input
              name="price"
              type="text"
              placeholder="Price (per night)"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            />
            <button
              type="submit"
              className="upload-btn bg-indigo-600 text-white hover:bg-indigo-500 border-none py-3 px-6 rounded-md text-lg cursor-pointer transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload property"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPropertyForm;
