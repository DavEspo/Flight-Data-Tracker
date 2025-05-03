CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookingId INT NOT NULL,
  cardNumber VARCHAR(20),
  expiry VARCHAR(10),
  cvv VARCHAR(10),
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
);

SELECT * FROM payments;