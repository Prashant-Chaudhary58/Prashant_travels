import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileComponent from "../components/ProfileNav";

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/properties/deleteProperty/${propertyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove property from state
        setProperties(prevProperties => 
          prevProperties.filter(property => property.property_id !== propertyId)
        );
        alert('Property deleted successfully');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete property: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        console.log("Profile data received:", data); // Add this line for debugging
        setUserData(data);

        // Fetch properties only if profile fetch is successful
        const propertiesResponse = await fetch(
          "http://localhost:5000/properties/viewAllProperty",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData);
        }

        // Update the bookings fetch
        try {
          const bookingsResponse = await fetch(
            'http://localhost:5000/api/bookings/all-bookings',
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (bookingsResponse.ok) {
            const data = await bookingsResponse.json();
            console.log('Bookings data:', data); // Debug log
            setBookings(data.bookings || []); // Access the bookings array from the response
          } else {
            console.error('Failed to fetch bookings:', bookingsResponse.statusText);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="bg-red-100 p-4 rounded-lg">
          {error}. Please try{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 underline"
          >
            refreshing
          </button>
          .
        </div>
      </div>
    );
  }

  // Filter properties to show only those owned by the current user
  const userProperties = properties.filter(
    (property) => property.owner_id === userData?.user?.id.toString()
  );

  // Filter bookings to show only those made by the current user
  const userBookings = bookings.filter(
    (booking) => booking.guest_id === userData?.user?.id
  );

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="w-full bg-[#001A72] p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          {userData?.user ? <ProfileComponent userData={userData} /> : null}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors ml-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Properties Display Section */}
      <section className="p-6 bg-white mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#001A72]">My Properties</h2>
            <Link
              to="/addproperty"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Add New Property
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading properties...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : userProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              You haven't listed any properties yet.
              <Link
                to="/addproperty"
                className="block mt-4 text-blue-500 hover:text-blue-600"
              >
                + Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 w-fit mx-auto">
              {userProperties.map((property) => (
                <div key={property.property_id} className="text-center">
                  <Link 
                    to={`/booking/${property.owner_name}`} 
                    state={{
                      img: property.image[0],
                      city: property.city,
                      location: property.location,
                      description: property.description,
                      price: `Rs. ${property.price}`,
                      title: property.title,
                      owner: property.owner_name,
                      facilities: property.facilities
                    }}
                    className="block"
                  >
                    <div className="relative w-80 h-48 mb-2">
                      {property.image && property.image[0] ? (
                        <img
                          src={property.image[0]}
                          alt={property.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Image failed to load:', property.image[0]);
                            e.target.src = '/placeholder-image.jpg';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProperty(property.property_id);
                        }}
                        disabled={isDeleting}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        {isDeleting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold truncate">
                        {property.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-red-500 text-lg font-medium">
                          Rs. {property.price}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          per night
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Updated Bookings Section */}
      <section className="p-6 bg-white mt-8 rounded-lg shadow">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#001A72] mb-6">My Bookings</h2>
          
          {userBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
              <p>You haven't made any bookings yet.</p>
              <Link to="/" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {userBookings.map((booking) => (
                <div 
                  key={booking.booking_id} 
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-[#001A72]">
                        Booking #{booking.booking_id}
                      </h3>
                      <p className="text-gray-600 mt-1">Guest: {booking.guest_name}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-600">
                          <span className="font-medium">Check-in:</span>{' '}
                          {new Date(booking.check_in).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Check-out:</span>{' '}
                          {new Date(booking.check_out).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Guests:</span>{' '}
                          {booking.num_guests} people
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        Rs. {booking.total_price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.no_of_nights} nights
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
