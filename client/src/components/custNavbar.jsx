import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png'; 
import { 
  Home, 
  Calendar, 
  Star, 
  LogOut 
} from 'lucide-react';



const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleLogout = () => {
    setIsModalOpen(true); // Show the modal when logout button is pressed
  };

  const handleConfirmLogout = () => {
    setIsModalOpen(false); // Close the modal
    navigate('/login'); // Navigate to login page
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false); // Close the modal if user cancels
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-800 text-white flex justify-between items-center px-6 py-4 shadow-md z-50">
      {/* Logo Section */}
      <div className="flex items-center">
      <img
          src={Logo}  
          alt="Event Ticketing Logo"
          className="h-10 w-10 rounded-full mr-3"
        />

        <span className="text-xl font-bold">Tickify</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-16">
          <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
          <Link to="/home" className="flex items-center">
            <Home className="mr-2" />
            Home
          </Link>
        </div>
        <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
        <Link to="/events" className="flex items-center">
          <Calendar className="mr-2" />
          Events
          </Link>
        </div>
        <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
        <Link to="/favorites" className="flex items-center">
          <Star className="mr-2" />
          Favorites
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="mr-2" />
        Logout
      </button>

      {/* Modal Component */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    
    </nav>
  );
};

function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null; // Only render the modal if it's open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold text-center text-black">Are you sure you want to logout?</h3>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-red-700 text-white rounded-md"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}


export default Navbar;


