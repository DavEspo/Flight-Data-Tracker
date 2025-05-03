// controllers/bookingController.mjs
import { saveBookingAndPassengers, fetchBookingsByUser, removeBooking } from '../services/bookingService.mjs';
import { updateFlightPricing, ensureFlightSeeded } from "../services/flightService.mjs";
import { extractPriceValue } from '../utils/priceUtils.mjs';

export const createBooking = async (req, res) => {
  try {
    const { flight, travelers, userEmail, payment } = req.body;

    if (!flight || !flight.id || !flight.price || !travelers || !userEmail) {
      return res.status(400).json({ message: "Missing required booking information." });
    }

    const priceValue = extractPriceValue(flight.price);
    if (isNaN(priceValue)) {
      console.error("Invalid price value received:", flight.price);
      return res.status(400).json({ message: "Invalid flight price format." });
    }

    console.log("Extracted price:", priceValue);

    // Ensure flight is in DB
    await ensureFlightSeeded(flight);


    const bookingId = await saveBookingAndPassengers(flight, travelers, userEmail, payment);

    await updateFlightPricing(flight.id);

    res.status(201).json({ message: "Booking created successfully", bookingId });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const bookings = await fetchBookingsByUser(userEmail);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await removeBooking(bookingId);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};