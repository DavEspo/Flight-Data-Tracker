// services/searchFlightsService.mjs
import axios from 'axios';
import { getAccessToken } from '../utils/getAccessToken.mjs';

export async function searchFlights(query) {
  const token = await getAccessToken();

  const params = {};
  if (query.origin) params.originLocationCode = query.origin;
  if (query.destination) params.destinationLocationCode = query.destination;
  if (query.departureDate) params.departureDate = query.departureDate;
  if (query.adults) params.adults = query.adults;
  
  params.currencyCode = 'USD';
  params.max = 20;

  console.log("📤 Amadeus flight search params:", params);

  if (query.returnDate?.trim()) {
    params.returnDate = query.returnDate;
  }

  const response = await axios.get(
    'https://test.api.amadeus.com/v2/shopping/flight-offers',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
}
