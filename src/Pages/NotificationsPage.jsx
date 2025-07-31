import { useState, useEffect } from 'react';
import Navbar from '../components/NavbarB';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingBooking, setUpdatingBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/all');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingBooking(bookingId);
      
      console.log('Sending update request:', {
        bookingId,
        newStatus,
        url: `http://localhost:5000/api/bookings/status/${bookingId}`
      });

      const response = await fetch(`http://localhost:5000/api/bookings/status/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.text();
      console.log('Raw response:', data);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${data}`);
      }

      const jsonData = JSON.parse(data);

      // Update local state to reflect the change
      setBookings(bookings.map(booking => 
        booking.booking_id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      // Show success message
      toast.success(`Booking status updated to ${newStatus}`);

    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(`Failed to update booking status: ${err.message}`);
    } finally {
      setUpdatingBooking(null);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

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
      <div className="container mx-auto mt-40 px-4">
        <h1 className="text-3xl font-bold mb-6">Bookings</h1>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Guest: {booking.guest_name}</h2>
                  <p className="text-gray-600">Phone: {booking.phone}</p>
                  <p className="text-gray-600">Guests: {booking.num_guests}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    Rs. {booking.total_price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking.booking_id, e.target.value)}
                      disabled={updatingBooking === booking.booking_id}
                      className="ml-2 text-sm border rounded p-1"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Check-in: {format(new Date(booking.check_in), 'MMM dd, yyyy')}</p>
                  <p>Check-out: {format(new Date(booking.check_out), 'MMM dd, yyyy')}</p>
                  <p>Nights: {booking.no_of_nights}</p>
                </div>
              </div>
              {updatingBooking === booking.booking_id && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
