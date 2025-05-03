// routes/searchFlightsRoute.mjs
import express from 'express';
import { handleFlightSearch } from '../controllers/searchFlightsController.mjs';

const router = express.Router();
router.get('/', handleFlightSearch);

export default router;
