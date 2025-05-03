import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SeatMap from "./SeatMap";

type Traveler = {
  firstName: string;
  lastName: string;
  seat: string;
};

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { flight, flightOrderId, userEmail, seatMap } = location.state || {};
  const travelerName = location.state?.travelerName;
  const travelerInfo = location.state?.travelerInfo;
  const travelers = (location.state?.travelers || []) as Traveler[];

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedSeats");
    if (stored) {
      setSelectedSeats(JSON.parse(stored));
    }
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        ✅ Booking Confirmed!
      </Typography>
      <Typography variant="h6">Passenger: {travelerName}</Typography>
      <Typography>
        Flight from {flight.itineraries[0].segments[0].departure.iataCode} to{" "}
        {flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}
      </Typography>

      <Box mt={4}>
        <Typography variant="h6">Passenger Details:</Typography>
        {travelers.map((traveler, index) => (
          <Box key={index} mb={2}>
            <Typography>
              {traveler.firstName} {traveler.lastName} – Seat: {traveler.seat}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}


export default Confirmation;
