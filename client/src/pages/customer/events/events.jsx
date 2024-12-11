import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { SearchIcon, StarIcon, TicketIcon, FilterIcon, MapPinIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import Navbar from '../../../components/custNavbar';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [events, setEvents] = useState([]);  
  const navigate = useNavigate();

  // Fetch events from the backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/events');
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.existingEvents);
          // Initialize favorites array with events that are already marked as favorite
          const initialFavorites = data.existingEvents
            .filter(event => event.favourite)
            .map(event => event._id);
          setFavorites(initialFavorites);
        } else {
          console.log('No events found');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const toggleFavorite = async (eventId) => {
    try {
      // Find the current event
      const event = events.find(e => e._id === eventId);
      
      // Prepare the update data
      const updateData = {
        favourite: !event.favourite
      };

      // Make API call to update the event
      const response = await fetch(`http://localhost:8000/event/update/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === eventId 
              ? { ...event, favourite: !event.favourite }
              : event
          )
        );

        // Update favorites array
        setFavorites(prev => 
          prev.includes(eventId) 
            ? prev.filter(id => id !== eventId)
            : [...prev, eventId]
        );
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // Filter events based on the search term
  const filteredEvents = events.filter((event) =>
    event?.topic?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
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
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-5">Events</h1>

        <div className="mb-8 flex space-x-4">
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center">
            <FilterIcon className="mr-2" size={20} />
            Filters
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={event.image || 'https://via.placeholder.com/400x250'}
                  alt={event.topic}
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={() => toggleFavorite(event._id)}
                  className={`absolute top-3 right-3 p-2 rounded-full 
                    ${event.favourite 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-white/70 text-gray-600'}`}
                >
                  <StarIcon size={20} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{event.topic}</h3>
                <div className="space-y-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <MapPinIcon size={16} className="mr-2" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon size={16} className="mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-justify">{event.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mt-5"
                    onClick={() => navigate('/tickets',
                      { state: { 
                        eventName: event.topic, 
                        eventDate: formatDate(event.date), 
                        eventTime: event.time, 
                        eventVenue: event.venue, 
                        image: event.image  
                      } })}
                  >
                    <TicketIcon className="mr-2" size={20} />
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events Found */}
        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No events found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;