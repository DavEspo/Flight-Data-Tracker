CREATE TABLE pricing_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flight_id VARCHAR(100) NOT NULL,
  timestamp DATETIME NOT NULL,
  total_bookings INT NOT NULL,
  time_to_departure_minutes INT NOT NULL,
  day_of_week INT NOT NULL,
  hour_of_day INT NOT NULL,
  origin VARCHAR(10) NOT NULL,
  destination VARCHAR(10) NOT NULL,
  airline_code VARCHAR(10) NOT NULL,
  seats_remaining INT,
  base_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL
);

SELECT * FROM pricing_snapshots;