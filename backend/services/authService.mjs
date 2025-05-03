// services/authService.mjs
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/db.mjs';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const signup = async (firstName, lastName, email, password) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Missing required fields.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.execute(
    'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, hashedPassword]
  );
  return { message: "Signup successful" };
};


export const login = async (email, password) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Incorrect password');

  const token = jwt.sign(
    {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
};
