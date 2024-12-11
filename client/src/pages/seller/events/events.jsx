import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  TicketIcon,
  TagIcon
} from "lucide-react";
import SellerNavbar from "../../../components/sellerNavbar";

const SellerEventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    venue: "",
    time: "",
    date: "",
    category: "",
    image: "",
    totalTickets: "",
    avgPrice: "",
    soldTickets: 0,
    revenue: 0
  });
  const navigate = useNavigate();


  // Reset form data when modal closes
  useEffect(() => {
    if (!isAddEventModalOpen && !editingEvent) {
      setFormData({
        topic: "",
        description: "",
        venue: "",
        time: "",
        date: "",
        category: "",
        image: "",
        totalTickets: "",
        avgPrice: "",
        soldTickets: 0,
        revenue: 0
      });
    }
  }, [isAddEventModalOpen, editingEvent]);

  // Set form data when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent);
    }
  }, [editingEvent]);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/events');
      if (response.data.success) {
        setEvents(response.data.existingEvents);
        setFilteredEvents(response.data.existingEvents);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and Search Logic
  useEffect(() => {
    let result = events;

    if (searchTerm) {
      result = result.filter((event) =>
        event.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter((event) => event.category === filterCategory);
    }

    setFilteredEvents(result);
  }, [searchTerm, filterCategory, events]);

  // Delete Event Handler
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axios.delete(`http://localhost:8000/event/delete/${eventId}`);
        if (response.data.message === "Delete successful") {
          await fetchEvents();
        }
      } catch (err) {
        setError(err.message);
        console.error('Error deleting event:', err);
      }
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

  // Render Add/Edit Event Modal
  const renderEventModal = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const submissionData = {
        ...formData,
        totalTickets: parseInt(formData.totalTickets),
        avgPrice: parseFloat(formData.avgPrice),
        image: formData.image || "/api/placeholder/400/320"
      };

      try {
        if (editingEvent) {
          const response = await axios.put(
            `http://localhost:8000/event/update/${editingEvent._id}`,
            submissionData
          );
          if (response.data.success) {
            await fetchEvents();
            setEditingEvent(null);
            setIsAddEventModalOpen(false);
          }
        } else {
          const response = await axios.post(
            'http://localhost:8000/event/save',
            submissionData
          );
          if (response.data.success) {
            await fetchEvents();
            setIsAddEventModalOpen(false);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error saving event:', err);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="topic"
                placeholder="Event Topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-32"
                required
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="time"
                placeholder="Time (e.g., 10:00 AM - 10:00 PM)"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date?.split('T')[0]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Festival">Festival</option>
                <option value="Music">Music</option>
                <option value="Conference">Conference</option>
                <option value="Comedy">Comedy</option>
                <option value="Sports">Sports</option>
              </select>
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
             
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setIsAddEventModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                {editingEvent ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div>
      <SellerNavbar />
      <div className="container mx-auto p-4 mt-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-64"
              />
              <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Festival">Festival</option>
              <option value="Music">Music</option>
              <option value="Conference">Conference</option>
              <option value="Comedy">Comedy</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsAddEventModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
          >
            <PlusIcon size={20} className="mr-2" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={event.image || "/api/placeholder/400/320"}
                alt={event.topic}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {event.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{event.topic}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
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
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center"
                  >
                    <EditIcon size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full flex items-center"
                  >
                    <TrashIcon size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
                <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mt-5"
                onClick={() => navigate('/seller/tickets',
                   { state: { 
                    eventName: event.topic, 
                    eventDate: formatDate(event.date), 
                    eventTime: event.time, 
                    eventVenue: event.venue, 
                    image: event.image  
                  } })}
              >
                <TicketIcon className="mr-2" size={20} />
                Add Tickets
              </button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {(isAddEventModalOpen || editingEvent) && renderEventModal()}
    </div>
  );
};

export default SellerEventsManagement;