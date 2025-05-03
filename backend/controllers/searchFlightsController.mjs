// controllers/searchFlightsController.mjs
import { searchFlights } from '../services/searchFlightsService.mjs';

export async function handleFlightSearch(req, res) {
  try {
    const flightData = await searchFlights(req.query);

    const normalized = flightData.map((flight, index) => ({
      id: flight.id || `flight-${index}`,
      price: flight.price,
      itineraries: flight.itineraries,
      validatingAirlineCodes: flight.validatingAirlineCodes,
    }));

    res.json({ data: normalized });
  } catch (err) {
    console.error('Flight search error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Flight search failed' });
  }
}