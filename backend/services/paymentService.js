// services/paymentService.js
import db from "../db/db.js";

export const savePayment = async (bookingId, { cardNumber, expiry, cvv }) => {
  await db.execute(
    `INSERT INTO payments (bookingId, cardNumber, expiry, cvv) VALUES (?, ?, ?, ?)`,
    [bookingId, cardNumber, expiry, cvv]
  );
};
