import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/background.png";
import carIcon from "../assets/icon/car.gif";
import dateIcon from "../assets/icon/date.gif";
import PeopleIcon from "../assets/icon/people.png";
import ThailandImg from "../assets/countries/thailand.png"
import NepalImg from "../assets/countries/Nepal.jpeg"
import IndonesiaImg from "../assets/countries/indonesia.png"
import Navbar from "../components/NavbarB";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const HomePage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/package/viewAllPackages');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      console.log('Property data:', data); // Add this line to debug
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const countryArray = [
    {
      img: NepalImg,
      city: "Nepal",
    },
    {
      img: ThailandImg,
      city: "Thailand",
    },
    {
      img: IndonesiaImg,
      city: "Indonesia",
    }
  ];

//   const packagesArray = [
//     {
//       img: BaliImg,
//       owner: "Bali",
//       location: "Bali, Indonesia",
//       price: "$ 2,499",
//       description: "A tropical paradise with stunning beaches and vibrant nightlife.",
//     },
//     {
//       img: ThaiImg,
//       owner: "Thailand",
//       location: "Bangkok, Thailand",
//       price: "$ 699",
//       description: "Experience the rich culture, street food, and temples of Bangkok.",
//     },
//     {
//       img: SingaporeImg,
//       owner: "Singapore",
//       location: "Singapore",
//       price: "$ 1,299",
//       description: "A luxurious stay in a futuristic city with world-class attractions.",
//     },
//     {
//       img: MaldivesImg,
//       owner: "Maldives",
//       location: "Maldives",
//       price: "$ 3,999",
//       description: "Overwater bungalows, crystal-clear waters, and ultimate relaxation.",
//     },
//     {
//       img: DubaiImg,
//       owner: "Dubai",
//       location: "Dubai, UAE",
//       price: "$ 1,999",
//       description: "A luxury escape with breathtaking skyscrapers and desert adventures.",
//     },
//     {
//       img: MalaysiaImg,
//       owner: "Malaysia",
//       location: "Malaysia",
//       price: "$ 1,499",
//       description: "A tropical paradise with stunning beaches and vibrant nightlife.",
//     },
//     {
//       img: ThaiImg,
//       owner: "Thailand",
//       location: "Bangkok, Thailand",
//       price: "$ 699",
//       description: "Experience the rich culture, street food, and temples of Bangkok.",
//     },
//     {
//       img: SingaporeImg,
//       owner: "Singapore",
//       location: "Singapore",
//       price: "$ 1,299",
//       description: "A luxurious stay in a futuristic city with world-class attractions.",
//     },
//     {
//       img: MaldivesImg,
//       owner: "Maldives",
//       location: "Maldives",
//       price: "$ 3,999",
//       description: "Overwater bungalows, crystal-clear waters, and ultimate relaxation.",
//     },
//     {
//       img: DubaiImg,
//       owner: "Dubai",
//       location: "Dubai, UAE",
//       price: "$ 1,999",
//       description: "A luxury escape with breathtaking skyscrapers and desert adventures.",
//     },
// ];


  return (
    <div>
      <Navbar />

      <div className="mt-40">
        {/* Hero Section */}
        <section
          className="bg-cover bg-center text-center text-white p-12"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <h1 className="text-5xl font-bold">Travel . Explore · Stay · Relax</h1>
          <p className="text-xl mt-2">
           Embark on your next adventure with us!
          </p>
        </section>

        {/* Search Bar */}
        <div className="flex -mt-8 rounded-xl w-fit mx-auto border-2 border-green-800 bg-green-800 p-0.5">
          <div className="relative p-0.5 rounded-lg border-2 border-green-800 mx-0.5">
            <input
              type="text"
              placeholder="Where are you going?"
              className="px-8 py-2.5 rounded-lg text-center bg-white"
            />
            <img
              src={carIcon}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6"
              alt="Car-icon"
            />
          </div>

          <div className="relative p-0.5 rounded-lg border-2 border-green-800 mx-0.5">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              className="px-10 py-2.5 rounded-lg text-center block w-fit bg-white"
              placeholderText="Check-in - Check-out"
            />
            <img
              src={dateIcon}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6"
              alt="date-icon"
            />
          </div>

          <div className="relative p-0.3 rounded-lg border-2 border-green-800 mx-0.3">
            <input
              type="number"
              min="1"
              placeholder="Number of people"
              className="px-12 py-2.5 rounded-lg text-center bg-white"
            />
            <img
              src={PeopleIcon}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6"
              alt="crowd-icon"
            />
          </div>

          <button className="bg-blue-500 text-white px-7 py-2.5 mx-0.5  rounded-lg border-2 border-green-800 hover:bg-blue-600">
            Search
          </button>
        </div>

        {/* Trending Countries */}
        <section className="p-6">
          <div className="trending-cities flex mx-60 ">
            <h2 className="text-3xl font-bold mb-4 text-left">
              Trending Countries
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6 w-fit mx-auto">
            {countryArray.map((city, index) => (
              <div key={index} className="text-left">
                <img src={city.img} alt={'photo'} className="rounded-lg w-80 h-48" />
                <p className="mt-2 font-bold text-xl">
                  {city.city}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* All Packages */}
        <section className="p-6">
          <div className="all-properties flex align-baseline mx-60">
            <h2 className="text-3xl font-bold mb-4 text-left">
              All Packages
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading packages...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-6 w-fit mx-auto">
              {properties.map((property) => (
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
                      facilities: property.facilities // Pass facilities directly
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
                            e.target.src = '/placeholder-image.jpg'; // Fallback image
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
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
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-4 gap-8">
              {/* About Section */}
              <div>
                <h3 className="text-xl font-bold mb-4">About Prashant Travels</h3>
                <p className="text-gray-300">
                  We are dedicated to providing the best travel experiences, offering unique stays and unforgettable adventures across the globe.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Home</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Search Stays</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">List Your Property</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Contact Us</a></li>
                </ul>
              </div>

              {/* Popular Destinations */}
              <div>
                <h3 className="text-xl font-bold mb-4">Popular Destinations</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Nepal</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Indonesia</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Thailand</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400">Viatenam</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="text-gray-300">📞 +977 987654321</li>
                  <li className="text-gray-300">✉️ info@travels.com</li>
                  <li className="text-gray-300">📍 Kathmandu, Nepal</li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
              <p>&copy; 2025 Prashant Travels. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
