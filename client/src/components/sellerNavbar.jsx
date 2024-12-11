import React from 'react'; 
import { Link } from 'react-router-dom'; 
import Logo from '../assets/images/Logo.png'; 
import {
    Home,
    Calendar,
    Ticket,
    User,
    LogOut 
} from 'lucide-react';  

const SellerNavbar = () => {
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
        
       {/* Navigation Links - Centered */}
       <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-20">
         <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
           <Link to="/" className="flex items-center">
             <Home className="mr-2" />
             Home
           </Link>
         </div>
         <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
           <Link to="/seller/events" className="flex items-center">
             <Calendar className="mr-2" />
             Events
           </Link>
         </div>
         <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors">
           <Link to="/seller/users" className="flex items-center">
             <User className="mr-2" />
             Users
           </Link>
         </div>
       </div>
        
       {/* Optional Logout Button - Now positioned on the right */}
       {/* <div className="flex items-center">
         <button
            className="flex items-center px-4 py-2 
            bg-red-600 hover:bg-red-700 rounded-md transition-colors"
         >
           <LogOut className="mr-2" />
           Logout
         </button>
       </div> */}
     </nav>
   );
};

export default SellerNavbar;