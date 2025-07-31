
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/NavbarB";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage = () => {
  const { owner } = useParams();
  const location = useLocation();
  const stay = location.state;

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    guests: ""
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Helper to parse price string (handles Rs, $ etc)
  const parsePriceString = (priceString) => {
    const numericString = priceString.replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  };

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (startDate && endDate && formData.guests) {
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const basePrice = parsePriceString(stay.price);
      const calculatedTotal = nights * basePrice * parseInt(formData.guests);
      setTotalPrice(calculatedTotal);
    } else {
      setTotalPrice(0);
    }
  }, [dateRange, stay.price, formData.guests]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.guests.trim()) newErrors.guests = "Number of people is required";
    if (!startDate || !endDate) newErrors.dates = "Please select check-in and check-out dates";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      if (!currentUser) {
        toast.error("Please login to make a booking");
        return;
      }
      // Use stay.id and stay.owner directly
      const propertyId = typeof stay.id === 'string' ? parseInt(stay.id) : stay.id;
      const ownerId = stay.owner;
      if (!propertyId || !ownerId) {
        toast.error("Booking failed: Package data is missing. Please try again from the homepage.");
        return;
      }
      setIsSubmitting(true);
      try {
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const guests = typeof formData.guests === 'string' ? parseInt(formData.guests) : formData.guests;
        const bookingData = {
          propertyId: Number(propertyId),
          ownerId: ownerId,
          guestId: Number(currentUser.id),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          guests: Number(guests),
          checkIn: startDate.toISOString(),
          checkOut: endDate.toISOString(),
          noOfNights: nights,
          totalPrice: parseFloat(totalPrice)
        };
        const response = await fetch('http://localhost:5000/api/bookings/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
        }
        if (!response.ok) {
          throw new Error(data.message || 'Booking failed');
        }
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

  if (!stay) {
    return <h2 className="text-center mt-20 text-xl">Package not found!</h2>;
  }

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
      <div className="p-10 mx-auto w-4/5 mt-35">
        {/* Package Info */}
        <div className="flex gap-10">
          {/* Image */}
          <img src={stay.img} alt="Package" className="w-2/5 h-96 rounded-lg" />

          {/* Package Details */}
          <div className="w-3/5">
            <h1 className="text-3xl font-bold">
              {owner}&apos;s Package, <span className="text-red-500">{stay.city}</span>
            </h1>
            <p className="text-gray-600 text-lg mt-1">📍 {stay.location}</p>

            {/* Description Box */}
            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <p className="text-gray-700">{stay.description}</p>
            </div>

            {/* Package Details */}
            <div className="mt-4 text-blue-600">
              <p className="text-lg font-semibold">📆 Duration: <span className="text-gray-700">5 Days / 4 Nights</span></p>
              <p className="text-lg font-semibold">🚗 Pick-up & Drop-off: <span className="text-gray-700">Included</span></p>
              <p className="text-lg font-semibold">🍽️ Meals: <span className="text-gray-700">Breakfast & Dinner</span></p>
              <p className="text-lg font-semibold">🏨 Accommodation: <span className="text-gray-700">4-Star Hotel</span></p>
              <p className="text-lg font-semibold">🎟️ Sightseeing Tours: <span className="text-gray-700">Guided</span></p>
            </div>

            {/* Price & Booking */}
            <h3 className="text-red-500 text-2xl mt-4">{stay.price} <span className="text-red-500 text-lg">/ per person</span></h3>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded" disabled>Book Now</button>
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-10 bg-gradient-to-r from-blue-500 to-indigo-700 p-10 rounded-md text-white w-3/4 mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Booking Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className={`w-full p-2 bg-amber-50 rounded text-black ${errors.fullName ? 'border-2 border-red-500' : ''}`}
              />
              {errors.fullName && <p className="text-red-200 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone No"
                className={`w-full bg-amber-50 p-2 rounded text-black ${errors.phone ? 'border-2 border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-200 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="mb-4">
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                placeholder="No of people"
                min="1"
                className={`w-full p-2 bg-amber-50 rounded text-black ${errors.guests ? 'border-2 border-red-500' : ''}`}
              />
              {errors.guests && <p className="text-red-200 text-sm mt-1">{errors.guests}</p>}
            </div>
            <div className="mb-4">
              <div className={`react-datepicker-wrapper w-full p-2 bg-amber-50 rounded text-black ${errors.dates ? 'border-2 border-red-500' : ''}`}>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
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
                  <span>Price per person per night:</span>
                  <span>{parsePriceString(stay.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Total nights:</span>
                  <span>{Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>No of people:</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="flex justify-between mt-2 text-xl font-bold">
                  <span>Total Price:</span>
                  <span>{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full mt-2 px-4 py-2 bg-white text-blue-500 font-bold rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingPage;
