import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketPage = () => {
  const location = useLocation();
  const { eventName, eventDate, eventTime, eventVenue, image, total } = location.state || {};

  const [tickets, setTickets] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8000/tickets/event/${eventName}`);
        const fetchedTickets = response.data.tickets;
        
        const initialQuantities = fetchedTickets.reduce((acc, ticket) => {
          acc[ticket._id] = 0;
          return acc;
        }, {});

        setTickets(fetchedTickets);
        setTicketQuantities(initialQuantities);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tickets');
        setIsLoading(false);
      }
    };

    if (eventName) {
      fetchTickets();
    }
  }, [eventName]);

  const handleBack = () => {
    window.history.back();
  };

  const updateTicketQuantity = (ticketId, currentCount, change) => {
    const ticket = tickets.find(t => t._id === ticketId);
    
    const newQuantity = Math.max(0, Math.min(
      currentCount + change, 
      ticket.count || 0
    ));

    setTicketQuantities(prev => ({
      ...prev,
      [ticketId]: newQuantity
    }));
  };

  const calculateTotalAmount = () => {
    return tickets.reduce((total, ticket) => {
      return total + (ticket.price * ticketQuantities[ticket._id]);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    // Get selected tickets with all relevant information
    const selectedTickets = tickets
      .filter(ticket => ticketQuantities[ticket._id] > 0)
      .map(ticket => ({
        id: ticket._id,
        ticketType: ticket.ticketType,
        description: ticket.description,
        price: ticket.price,
        quantity: ticketQuantities[ticket._id],
        subtotal: ticket.price * ticketQuantities[ticket._id]
      }));
  
    // Calculate order summary
    const totalQuantity = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalAmount = calculateTotalAmount();
  
    // Navigate to checkout with comprehensive event and ticket information
    navigate('/checkout', {
      state: {
        eventName: eventName,
        date: eventDate,
        time: eventTime,
        eventVenue: eventVenue,
        image: image,
        total: total,
        tickets: selectedTickets,
        ticketQuantities: ticketQuantities,
        totalAmount: totalAmount, 
        totalQuantity: totalQuantity 
      }
    });
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Cover Image */}
      <div className="relative h-1/2">
        <img 
          src={image} 
          alt={eventName} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-4 left-4">
          <button 
            onClick={handleBack}
            className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">{eventName}</h1>
          <div className="flex items-center mt-2">
            <MapPin size={16} className="mr-2" />
            <span>{eventVenue}</span>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-center text-gray-500">No tickets available for this event</p>
        ) : (
          <>
            {tickets.map((ticket) => (
              <div 
                key={ticket._id} 
                className="flex justify-between items-center mb-4 p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">Rs. {ticket.price}</p>
                  <p className="text-gray-500">{ticket.description || ticket.ticketType}</p>
                  <p className="text-sm text-green-600">
                    {ticket.count} tickets available
                  </p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => updateTicketQuantity(ticket._id, ticketQuantities[ticket._id], -1)}
                    className="px-3 py-1 border rounded-l-lg"
                    disabled={ticketQuantities[ticket._id] <= 0}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={ticketQuantities[ticket._id]} 
                    readOnly 
                    className="w-12 text-center border-t border-b"
                  />
                  <button 
                    onClick={() => updateTicketQuantity(ticket._id, ticketQuantities[ticket._id], 1)}
                    className="px-3 py-1 border rounded-r-lg"
                    disabled={ticketQuantities[ticket._id] >= ticket.count}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p>Total Amount:{calculateTotalAmount()} LKR</p>
            </div>

            <button 
              className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 disabled:bg-gray-300"
              disabled={Object.values(ticketQuantities).every(q => q === 0)}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketPage;