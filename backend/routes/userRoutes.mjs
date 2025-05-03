// routes/userRoutes.mjs
import express from 'express';
import { deleteUser } from '../controllers/userController.mjs';

const router = express.Router();

router.delete('/:email', deleteUser);

export default router;