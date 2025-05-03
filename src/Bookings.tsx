import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Traveler {
  firstName: string;
  lastName: string;
  seatNumber: string;
}

interface Booking {
  bookingId: number;
  userEmail: string;
  flightData: any;
  travelerName?: string;
  seat_numbers?: string[] | string; // optional, fallback
  travelers?: Traveler[];
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      fetchBookings(email);
    } else {
      setError("No user email found. Please log in again.");
    }
  }, []);
  
  const fetchBookings = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/bookings/${userEmail}`);
      const data = await response.json();
      console.log('User bookings:', data);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings. Please try again later.");
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      const data = await response.json();
      console.log('Booking canceled:', data);
      const email = localStorage.getItem("userEmail");
      if (email) {
        fetchBookings(email);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError("Failed to cancel booking. Please try again later.");
    }
  };
  
  
  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Your Bookings
      </Typography>
      <List>
        {bookings.map((booking) => {
          const flight = booking.flightData?.itineraries?.[0]?.segments?.[0];
          const seats = Array.isArray(booking.seat_numbers)
            ? booking.seat_numbers
            : JSON.parse(booking.seat_numbers || "[]");

          return (
            <ListItem key={booking.bookingId} divider alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    ✈️ <strong>Flight:</strong> {flight?.carrierCode || "??"} {flight?.number || "??"}
                    <br />
                    <strong>From:</strong> {flight?.departure?.iataCode || "?"} → <strong>To:</strong> {flight?.arrival?.iataCode || "?"}
                    <br />
                    <strong>Departure:</strong> {new Date(flight?.departure?.at).toLocaleString() || "???"}
                  </>
                }
                secondary={
                  <Box mt={1}>
                    {booking.travelers && booking.travelers.length > 0 ? (
                      <Stack direction="column" spacing={1}>
                        {booking.travelers.map((traveler, idx) => (
                          <Chip
                            key={idx}
                            label={`${traveler.firstName} ${traveler.lastName} - Seat ${traveler.seatNumber}`}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    ) : (
                      seats.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <strong>Seats:</strong>
                          {seats.map((seat: string) => (
                            <Chip
                              key={seat}
                              label={seat}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      )
                    )}
                  </Box>
                }
              />

              <Button
                variant="outlined"
                color="error"
                // onClick={() => handleCancel(booking.id)}
                onClick={() => cancelBooking(booking.bookingId)}
                sx={{ ml: 2, height: "fit-content" }}
              >
                Cancel
              </Button>
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="contained"
        onClick={() => navigate("/dashboard")}
        sx={{ mt: 3 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Bookings;
