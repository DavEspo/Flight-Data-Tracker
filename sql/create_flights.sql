CREATE TABLE flights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amadeus_id VARCHAR(100) NOT NULL UNIQUE,
  base_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  total_bookings INT DEFAULT 0,
  last_booking_time DATETIME NULL,
  cooldown_end_time DATETIME NULL,
  origin VARCHAR(10) NOT NULL,
  destination VARCHAR(10) NOT NULL,
  departure_time DATETIME NOT NULL,
  airline_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM flights