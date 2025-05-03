// services/bookingService.mjs
import pool from '../db/db.mjs';

export const saveBookingAndPassengers = async (flight, travelers, userEmail, payment) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert booking
    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (userEmail, flightData) VALUES (?, ?)',
      [userEmail, JSON.stringify(flight)]
    );
    const bookingId = bookingResult.insertId;

    // Insert passengers
    for (const traveler of travelers) {
      const { firstName, lastName, dateOfBirth, email, seat, phone, gender, passportNumber } = traveler;

      await connection.query(
        `INSERT INTO passengers 
         (bookingId, firstName, lastName, dateOfBirth, email, seat, phone, gender, passportNumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [bookingId, firstName, lastName, dateOfBirth, email, seat, phone, gender, passportNumber]
      );
    }

    // Insert payment
    if (payment) {
      const { cardNumber, expiry, cvv } = payment;
      await connection.query(
        `INSERT INTO payments (bookingId, cardNumber, expiry, cvv) VALUES (?, ?, ?, ?)`,
        [bookingId, cardNumber, expiry, cvv]
      );
    }

    await connection.commit();
    return bookingId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


export const fetchBookingsByUser = async (userEmail) => {
  const [bookings] = await pool.query(
    `SELECT b.id AS bookingId, b.flightData, b.bookingDate,
            p.id AS passengerId, p.firstName, p.lastName, p.dateOfBirth, p.email, p.seat
     FROM bookings b
     LEFT JOIN passengers p ON b.id = p.bookingId
     WHERE b.userEmail = ?
     ORDER BY b.bookingDate DESC`,
    [userEmail]
  );

  // Group passengers by booking
  const bookingsMap = {};

  for (const row of bookings) {
    if (!bookingsMap[row.bookingId]) {
      bookingsMap[row.bookingId] = {
        bookingId: row.bookingId,
        flightData: row.flightData,
        bookingDate: row.bookingDate,
        passengers: [],
      };
    }

    if (row.passengerId) {
      bookingsMap[row.bookingId].passengers.push({
        id: row.passengerId,
        firstName: row.firstName,
        lastName: row.lastName,
        dateOfBirth: row.dateOfBirth,
        email: row.email,
        seat: row.seat,
      });
    }
  }

  return Object.values(bookingsMap);
};

export const removeBooking = async (bookingId) => {
  await pool.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
};