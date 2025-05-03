// utils/getAccessToken.mjs
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

console.log('AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY);
console.log('AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET);

let cachedToken = null;
let tokenExpiry = null;

export const getAccessToken = async () => {
  const now = new Date();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = new Date(now.getTime() + response.data.expires_in * 1000);
  return cachedToken;
};
