SELECT b.id AS bookingId, b.flightData, b.bookingDate,
	   p.id AS passengerId, p.firstName, p.lastName, p.dateOfBirth, p.email, p.seat
FROM bookings b
LEFT JOIN passengers p ON b.id = p.bookingId
WHERE b.userEmail = 'ch@gmail.com'
ORDER BY b.bookingDate DESC