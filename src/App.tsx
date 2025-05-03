import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import FlightsAvailable from "./FlightsAvailable";
import BookingPage from './BookingPage';
import Payment from './Payment';
import Confirmation from "./Confirmation";
import Bookings from "./Bookings";
import Settings from "./Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/flights" element={<FlightsAvailable />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
