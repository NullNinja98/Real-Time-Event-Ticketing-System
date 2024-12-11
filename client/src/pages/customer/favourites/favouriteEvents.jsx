import React, { useState, useEffect } from 'react';
import { Trash2Icon, TicketIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/custNavbar';

const FavoritesPage = () => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch favorite events from the backend
  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/events');
        const data = await response.json();
        
        if (data.success) {
          // Filter events where favourite is true
          const favorites = data.existingEvents.filter(event => event.favourite);
          setFavoriteEvents(favorites);
        }
      } catch (error) {
        console.error('Error fetching favorite events:', error);
      }
    };

    fetchFavoriteEvents();
  }, []);

  // Remove from favorites (update favorite status to false)
  const removeFromFavorites = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8000/event/update/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favourite: false })
      });

      const data = await response.json();

      if (data.success) {
        // Remove the event from the local state
        setFavoriteEvents(prev => prev.filter(event => event._id !== eventId));
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Favorite Events</h1>

        {favoriteEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No favorite events added yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteEvents.map(event => (
              <div
                key={event._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={event.image || '/api/placeholder/400/250'}
                    alt={event.topic}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromFavorites(event._id)}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <Trash2Icon size={20} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{event.topic}</h3>
                  <p className="text-gray-600 mb-2">{formatDate(event.date)}</p>
                  <p className="text-gray-600 mb-2">{event.time}</p>
                  <p className="text-gray-600 mb-4">{event.venue}</p>
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
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;