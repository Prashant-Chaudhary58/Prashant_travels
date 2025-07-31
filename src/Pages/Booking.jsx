import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FaUsers, FaParking, FaHotTub, FaCar, FaCoffee, FaUtensils, FaChild, FaWifi, FaTv, FaSwimmingPool, FaSnowflake } from "react-icons/fa";
import Navbar from "../components/NavbarB";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const amenityIcons = {
  'Family stay': { icon: FaUsers, label: "Family Stay" },
  'Taxi service': { icon: FaCar, label: "Taxi Service" },
  'Tea / Coffee': { icon: FaCoffee, label: "Tea/Coffee Service" },
  'Parking': { icon: FaParking, label: "Secure Parking" },
  'Swimming pool': { icon: FaSwimmingPool, label: "Swimming Pool" },
  'AC': { icon: FaSnowflake, label: "Air Conditioning" },
  'TV': { icon: FaTv, label: "Smart TV" },
  'Restaurant': { icon: FaUtensils, label: "Restaurant" },
  'Hot tub': { icon: FaHotTub, label: "Hot Tub" },
  'Child friendly': { icon: FaChild, label: "Child Friendly" },
  'Wifi': { icon: FaWifi, label: "Free WiFi" }
};

const BookingPage = () => {
  const { owner } = useParams();
  const location = useLocation();
  const travelPackage = location.state;

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [formData, setFormData] = useState({ fullName: "", phone: "", guests: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const parsePriceString = (priceString) => {
    const numericString = priceString.replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  };

  useEffect(() => {
    if (startDate && endDate) {
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const basePrice = parsePriceString(travelPackage.price);
      setTotalPrice(nights * basePrice);
    } else {
      setTotalPrice(0);
    }
  }, [dateRange, travelPackage.price]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.guests.trim()) newErrors.guests = "Number of guests is required";
    if (!startDate || !endDate) newErrors.dates = "Please select check-in and check-out dates";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      if (!currentUser) return toast.error("Please login to make a booking");

      setIsSubmitting(true);
      try {
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const bookingData = {
          packageId: parseInt(travelPackage.id) || 1,
          ownerId: owner,
          guestId: currentUser.id,
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          guests: parseInt(formData.guests),
          checkIn: startDate.toISOString(),
          checkOut: endDate.toISOString(),
          noOfNights: nights,
          totalPrice: parseFloat(totalPrice)
        };

        const response = await fetch('http://localhost:5000/api/bookings/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(bookingData)
        });

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        if (!response.ok) throw new Error(data.message || 'Booking failed');

        toast.success("Booking successful!");
        setFormData({ fullName: "", phone: "", guests: "" });
        setDateRange([null, null]);
      } catch (error) {
        toast.error(`Booking failed: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (!travelPackage) return <h2 className="text-center mt-20 text-xl">Package not found!</h2>;

  const renderAmenities = () => {
    if (!travelPackage?.facilities || travelPackage.facilities.length === 0) {
      return <p className="text-gray-500">No facilities listed</p>;
    }
    return (
      <div className="flex flex-wrap gap-4 text-blue-600">
        {travelPackage.facilities.map((facility, index) => {
          const amenityConfig = amenityIcons[facility];
          if (!amenityConfig) return null;
          const Icon = amenityConfig.icon;
          return (
            <div key={index} className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
              <Icon className="text-blue-500" />
              <span className="text-sm">{amenityConfig.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="p-10 mx-auto w-4/5 mt-35">
        <div className="flex gap-10">
          <img src={travelPackage.img} alt="Package" className="w-2/5 h-96 rounded-lg" />
          <div className="w-3/5">
            <h1 className="text-3xl font-bold">{travelPackage.title}</h1>
            {owner && (
              <p className="hidden text-xl mt-2">package no: <span className="text-blue-500">{owner}</span></p>
            )}
            <p className="text-gray-600 text-lg mt-1">📍 {travelPackage.location}</p>
            <p className="text-gray-600">{travelPackage.city}</p>
            <div className="mt-6 text-gray-700">{travelPackage.description}</div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Available Amenities</h3>
              {renderAmenities()}
            </div>
            <h3 className="text-red-500 text-2xl mt-4">{travelPackage.price} <span className="text-red-500 text-lg">/ per night</span></h3>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-r from-blue-500 to-indigo-900 p-14 w-mx-auto rounded-md text-white">
          <h2 className="text-xl font-bold mb-9 text-center">Booking Details</h2>
          <form onSubmit={handleSubmit}>
            {['fullName', 'phone', 'guests'].map(field => (
              <div className="mb-4" key={field}>
                <input
                  type={field === 'guests' ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field === 'fullName' ? 'Your full name' : field === 'phone' ? 'Phone No' : 'No of people'}
                  className={`w-full p-2 bg-amber-50 rounded text-black ${errors[field] ? 'border-2 border-red-500' : ''}`}
                />
                {errors[field] && <p className="text-red-200 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div className="mb-4">
              <div className={`react-datepicker-wrapper w-full p-2 bg-amber-50 rounded text-black ${errors.dates ? 'border-2 border-red-500' : ''}`}>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={setDateRange}
                  isClearable
                  className="w-full p-2 bg-amber-50 rounded text-black"
                  placeholderText="Check-in - Check-out"
                  minDate={new Date()}
                />
              </div>
              {errors.dates && <p className="text-red-200 text-sm mt-1">{errors.dates}</p>}
            </div>

            {totalPrice > 0 && (
              <div className="mb-10 p-4 bg-white/10 rounded">
                <h3 className="font-semibold">Price Summary</h3>
                <div className="flex justify-between mt-2">
                  <span>Price per night:</span>
                  <span>Rs {parsePriceString(travelPackage.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Total nights:</span>
                  <span>{Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between mt-2 text-xl font-bold">
                  <span>Total Price:</span>
                  <span>Rs {totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2 bg-white text-blue-500 font-bold rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingPage;