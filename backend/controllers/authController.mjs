// controllers/authController.mjs
import * as authService from '../services/authService.mjs';

export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await authService.signup(firstName, lastName, email, password);
    res.status(200).json(result);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}