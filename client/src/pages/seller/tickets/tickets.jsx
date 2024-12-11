import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import { Pencil, Trash2, Plus, X, Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react';

const EventTickets = () => {
    const location = useLocation();
    const { eventName, eventDate, eventTime, eventVenue, image } = location.state || {};

    const [tickets, setTickets] = useState([]);
    const [editingTicket, setEditingTicket] = useState(null);
    const [isAddingTicket, setIsAddingTicket] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tickets for the specific event when component mounts
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8000/tickets/event/${eventName}`);
                setTickets(response.data.tickets);
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

    const handleDelete = async (ticketId) => {
        try {
            await axios.delete(`http://localhost:8000/ticket/delete/${ticketId}`);
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete ticket');
        }
    };

    const handleUpdate = async (updatedTicket) => {
        try {
            const response = await axios.put(`http://localhost:8000/ticket/update/${updatedTicket._id}`, {
                ...updatedTicket,
                topic: eventName // Ensure the event name is included
            });
            
            setTickets(tickets.map(ticket => 
                ticket._id === updatedTicket._id ? response.data.ticket : ticket
            ));
            setEditingTicket(null);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update ticket');
        }
    };

    const handleAddTicket = async (newTicket) => {
        try {
            const ticketData = {
                ...newTicket,
                topic: eventName, // Add the event name
                ticketType: newTicket.type,
                count: newTicket.quantity
            };

            const response = await axios.post('http://localhost:8000/ticket/save', ticketData);
            
            setTickets([...tickets, response.data.ticket]);
            setIsAddingTicket(false);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add ticket');
        }
    };

    // The Modal and TicketForm components remain the same as in the previous implementation

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    const TicketForm = ({ ticket, onSubmit, isNew = false }) => (
        <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-gray-600">Type</label>
                <input
                    className="col-span-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={ticket?.type || ticket?.ticketType || ''}
                    onChange={(e) => setEditingTicket({...ticket, type: e.target.value, ticketType: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-gray-600">Price</label>
                <input
                    type="number"
                    className="col-span-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={ticket?.price || ''}
                    onChange={(e) => setEditingTicket({...ticket, price: parseFloat(e.target.value)})}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-gray-600">Quantity</label>
                <input
                    type="number"
                    className="col-span-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={ticket?.quantity || ticket?.count || ''}
                    onChange={(e) => setEditingTicket({...ticket, quantity: parseInt(e.target.value), count: parseInt(e.target.value)})}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-gray-600">Description</label>
                <textarea
                    className="col-span-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={ticket?.description || ''}
                    onChange={(e) => setEditingTicket({...ticket, description: e.target.value})}
                />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => onSubmit(ticket)}
                >
                    {isNew ? 'Add Ticket' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-blue-600">Loading tickets...</div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-96 bg-blue-900">
                <button 
                    onClick={handleBack}
                    className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-white" />
                </button>

                <img 
                    src={image}
                    alt={eventName}
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 text-white">{eventName}</h1>
                    <div className="flex gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {new Date(eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {eventVenue}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <Ticket className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-semibold text-gray-800">Available Tickets</h2>
                    </div>
                    <button
                        onClick={() => {
                            setIsAddingTicket(true);
                            setEditingTicket({});
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Ticket
                    </button>
                </div>

                
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {tickets.map(ticket => (
                            <div key={ticket._id} className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-shadow">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-gray-800">{ticket.type || ticket.ticketType}</h3>
                                        <span className="text-xl font-bold text-blue-600">
                                            {ticket.price.toFixed(2)} LKR
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{ticket.description}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Ticket className="h-4 w-4" />
                                        <span className="font-medium">{ticket.quantity || ticket.count}</span> tickets available
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            setIsAddingTicket(false);
                                            setEditingTicket(ticket);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ticket._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                
            </div>

            <Modal 
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingTicket(null);
                    setIsAddingTicket(false);
                }}
                title={isAddingTicket ? 'Add New Ticket' : 'Edit Ticket'}
            >
                <TicketForm 
                    ticket={editingTicket}
                    onSubmit={isAddingTicket ? handleAddTicket : handleUpdate}
                    isNew={isAddingTicket}
                />
            </Modal>
        </div>
    );
};

export default EventTickets;