// routes/bookingRoutes.mjs
import express from 'express';
import { createBooking, getBookingsByUser, deleteBooking } from '../controllers/bookingController.mjs';

const router = express.Router();

router.post('/', createBooking);
router.get('/:userEmail', getBookingsByUser);
router.delete('/:bookingId', deleteBooking);

export default router;