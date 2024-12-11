import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  TicketIcon, 
  SearchIcon, 
  FilterIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/custNavbar';

const EventTicketingHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");


  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      setError(""); // Clear previous errors

      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        setError("Unauthorized: No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token.");
          }
          throw new Error("Failed to fetch events.");
        }

        const data = await response.json();

        if (data.success) {
          const allEvents = data.existingEvents;
          const currentDate = new Date();

          // Sort events by date
          const sortedEvents = allEvents.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          // Get first two events for featured section
          setFeaturedEvents(sortedEvents.slice(0, 2));

          // Get upcoming events (events after current date)
          const upcoming = sortedEvents.filter(
            (event) => new Date(event.date) > currentDate
          );
          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message || "An error occurred while fetching events.");
      }
    };

    fetchEvents();
  }, []);

  const eventCategories = [
    'All', 'Music', 'Conference', 'Comedy', 'Theater', 'Sports', 'Food'
  ];

  // Filter events based on search and category
  const filteredFeaturedEvents = featuredEvents.filter(event => 
    event.topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || event.category === selectedCategory)
  );

  const filteredUpcomingEvents = upcomingEvents.filter(event => 
    event.topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || event.category === selectedCategory)
  );

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 p-6 mt-20">
        {/* Header Section */}
        <header className="mb-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Real-Time Event Ticketing
            </h1>
            <p className="text-gray-600 mb-6">
              Discover, Book, and Experience Unforgettable Events
            </p>
          </div>
        </header>

        {/* Search and Filter Section */}
        <div className="container mx-auto mb-8">
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input 
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
              />
              <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none pl-10"
              >
                {eventCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FilterIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Featured Events Section */}
        <section className="container mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Featured Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredFeaturedEvents.map(event => (
              <div 
                key={event._id} 
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img 
                  src={event.image || '/api/placeholder/800/400'} 
                  alt={event.topic} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{event.topic}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="mr-2" size={20} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="mr-2" size={20} />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                      onClick={() => navigate('/tickets', {
                        state: {
                          eventName: event.topic,
                          eventDate: formatDate(event.date),
                          eventTime: event.time,
                          eventVenue: event.venue,
                          image: event.image
                        }
                      })}
                    >
                      <TicketIcon className="mr-2" size={20} />
                      Buy Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredUpcomingEvents.map(event => (
              <div 
                key={event._id} 
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img 
                  src={event.image || '/api/placeholder/800/400'} 
                  alt={event.topic} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{event.topic}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="mr-2" size={18} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                      onClick={() => navigate('/events', {
                        state: {
                          eventName: event.topic,
                          eventDate: formatDate(event.date),
                          eventTime: event.time,
                          eventVenue: event.venue,
                          image: event.image
                        }
                      })}
                    >
                      <TicketIcon className="mr-2" size={20} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventTicketingHome;