// backend/server.mjs
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.mjs';
import bookingRoutes from './routes/bookingRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import searchFlightsRoute from './routes/searchFlightsRoute.mjs';
import './db/db.mjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search-flights', searchFlightsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));