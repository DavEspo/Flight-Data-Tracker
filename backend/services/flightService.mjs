// services/flightService.mjs
import db from "../db/db.mjs";
import { extractPriceValue } from "../utils/priceUtils.mjs";
import { calculatePrice } from "../utils/pricingLogic.mjs";
import { extractSeatsRemaining } from "../utils/seatMapUtils.mjs";
import { getAccessToken } from '../utils/getAccessToken.mjs';
import axios from 'axios';
import fetch from "node-fetch";

export const updateFlightPricing = async (flightId) => {
  try {
    const [rows] = await db.query(
      `SELECT amadeus_id, base_price, total_bookings, last_booking_time, current_price,
              origin, destination, airline_code, departure_time
       FROM flights WHERE amadeus_id = ?`,
      [flightId]
    );

    if (rows.length === 0) {
      throw new Error("Flight not found");
    }

    const flight = rows[0];
    const newTotalBookings = flight.total_bookings + 1;
    const now = new Date();

    // Get seat map and extract seats_remaining
    let seatsRemaining = null;
    try {
      const token = await getAccessToken();
      const seatMapResponse = await axios.get(
        `https://test.api.amadeus.com/v1/shopping/seatmaps`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { flightOrderId: flightId },
        }
      );
      seatsRemaining = extractSeatsRemaining(seatMapResponse.data);
    } catch (seatMapError) {
      console.error("Seat map fetch error (defaulting seatsRemaining to null):", seatMapError);
    }

    // Compute features for ML model
    const departureTime = new Date(flight.departure_time);
    const timeToDepartureMinutes = Math.floor((departureTime - now) / 60000);
    const dayOfWeek = departureTime.getUTCDay();
    const hourOfDay = departureTime.getUTCHours();

    // Call ML model prediction endpoint
    let predictedPrice = null;
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_bookings: newTotalBookings,
          time_to_departure_minutes: timeToDepartureMinutes,
          day_of_week: dayOfWeek,
          hour_of_day: hourOfDay,
          origin: flight.origin,
          destination: flight.destination,
          airline_code: flight.airline_code,
          seats_remaining: seatsRemaining || 0,
          base_price: flight.base_price,
        }),
      });

      const result = await response.json();
      predictedPrice = result.predicted_price;

      console.log(`Predicted price from model: $${predictedPrice}`);
    } catch (err) {
      console.error("Prediction model error (falling back to formula):", err);
      predictedPrice = calculatePrice(flight.base_price, newTotalBookings);
    }

    // Update flight in DB
    await db.query(
      `UPDATE flights 
       SET total_bookings = ?, current_price = ?, last_booking_time = ? 
       WHERE amadeus_id = ?`,
      [newTotalBookings, predictedPrice, now, flightId]
    );

    // Save snapshot
    await db.query(
      `INSERT INTO pricing_snapshots (
        flight_id, timestamp, total_bookings, time_to_departure_minutes,
        day_of_week, hour_of_day, origin, destination, airline_code,
        seats_remaining, base_price, current_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        flightId,
        now,
        newTotalBookings,
        timeToDepartureMinutes,
        dayOfWeek,
        hourOfDay,
        flight.origin,
        flight.destination,
        flight.airline_code,
        seatsRemaining,
        flight.base_price,
        predictedPrice,
      ]
    );

    return { newTotalBookings, newCurrentPrice: predictedPrice };
  } catch (error) {
    console.error("Error updating flight pricing:", error);
    throw error;
  }
};

export const ensureFlightSeeded = async (flight) => {
  try {
    console.log(flight);
    const {
      id,
      price,
      itineraries
    } = flight;
    
    const segment = itineraries[0]?.segments[0];
    const origin = segment?.departure?.iataCode || null;
    const destination = segment?.arrival?.iataCode || null;
    const departureTime = segment?.departure?.at || null;
    const airlineCode = segment?.carrierCode || null;
    
    const numericPrice = extractPriceValue(price);
    
    const [rows] = await db.query(
      "SELECT id FROM flights WHERE amadeus_id = ?",
      [id]
    );

    if (rows.length === 0) {
      console.log(`Seeding flight ${id} with full details`);
      await db.query(
        `INSERT INTO flights (
          amadeus_id, base_price, current_price, total_bookings,
          origin, destination, departure_time, airline_code,
          last_booking_time, cooldown_end_time
        ) VALUES (?, ?, ?, 0, ?, ?, ?, ?, NULL, NULL)`,
        [id, numericPrice, numericPrice, origin, destination, departureTime, airlineCode]
      );
    }
  } catch (error) {
    console.error("Error seeding flight:", error);
    throw error;
  }
};