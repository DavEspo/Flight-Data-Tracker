// scripts/seedFlights.mjs
import pool from "../db/db.mjs";
import { getAccessToken } from "../utils/getAccessToken.mjs";
import { extractPriceValue } from "../utils/priceUtils.mjs";
import axios from "axios";

async function seedFlights() {
  try {
    const accessToken = await getAccessToken();

    const searchParams = {
      originLocationCode: "JFK",
      destinationLocationCode: "LAX",
      departureDate: "2025-05-10",
      adults: 1,
    };

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: searchParams,
      }
    );

    const flights = response.data.data;

    for (const flight of flights) {
      const id = flight.id;
      const price = extractPriceValue(flight.price);

      if (isNaN(price)) {
        console.warn(`Skipping flight ${id} due to invalid price format:`, flight.price);
        continue;
      }

      const firstSegment = flight.itineraries?.[0]?.segments?.[0];
      if (!firstSegment) {
        console.warn(`Skipping flight ${id} due to missing segment info`);
        continue;
      }

      const origin = firstSegment.departure.iataCode;
      const destination = firstSegment.arrival.iataCode;
      const departureTime = firstSegment.departure.at;
      const airlineCode = firstSegment.carrierCode;

      try {
        await pool.query(
            `INSERT INTO flights (
              amadeus_id, base_price, current_price, total_bookings,
              origin, destination, departure_time, airline_code, last_booking_time, cooldown_end_time
            ) VALUES (?, ?, ?, 0, ?, ?, ?, ?, NULL, NULL)
             ON DUPLICATE KEY UPDATE 
              base_price = VALUES(base_price),
              origin = VALUES(origin),
              destination = VALUES(destination),
              departure_time = VALUES(departure_time),
              airline_code = VALUES(airline_code)`,
            [id, price, price, origin, destination, departureTime, airlineCode]
        );
          
        console.log(`Seeded flight ${id} (${origin} → ${destination}) at $${price}`);
      } catch (err) {
        console.error(`Failed to seed flight ${id}:`, err.message);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding flights:", err.message);
    process.exit(1);
  }
}

seedFlights();
