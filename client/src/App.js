import React from "react";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import EventsPage from "./pages/customer/events/events";
import FavoritesPage from "./pages/customer/favourites/favouriteEvents";
import EventTicketingHome from "./pages/customer/home/home";
import CheckoutPage from "./pages/customer/tickets/checkout";
import TicketPage from "./pages/customer/tickets/tickets";
import SellerDashboard from "./pages/seller/dashboard/sellerDashboard";
import SellerEventsManagement from "./pages/seller/events/events";
import Login from "./pages/customer/login/login";
import RegisterPage from "./pages/customer/register/register";
import UserManagement from "./pages/seller/users/users";
import EventTickets from "./pages/seller/tickets/tickets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/home" element={<EventTicketingHome/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/favorites" element={<FavoritesPage />}/>
        <Route path="/tickets" element={<TicketPage />}/>
        <Route path="/checkout" element={<CheckoutPage />}/>

        {/* Seller Routes */}
        <Route path="/" element={<SellerDashboard />}/>
        <Route path="/seller/events" element={<SellerEventsManagement />}/>
        <Route path="/seller/tickets" element={<EventTickets/>}/>
        <Route path="/seller/users" element={<UserManagement/>}/>


        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
