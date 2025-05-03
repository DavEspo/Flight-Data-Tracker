import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

interface Traveler {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  seat?: string; // I added seat later
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { flight, travelers, selectedSeats } = location.state as {
    flight: any;
    travelers: Traveler[];
    selectedSeats: string[];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill out all payment fields");
      return;
    }
  
    const travelersWithSeats = travelers.map((traveler, index) => ({
      ...traveler,
      seat: selectedSeats[index] || null,
    }));

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight,
          travelers: travelersWithSeats,
          userEmail: localStorage.getItem("userEmail"),
          payment: {
            cardNumber,
            expiry,
            cvv,
          },
        }),
      });
  
      const data = await response.json();
      console.log("Booking and payment success:", data);
  
      navigate("/confirmation", {
        state: {
          flight,
          travelers: travelersWithSeats,
          flightOrderId: data.flightOrderId,
          userEmail: localStorage.getItem("userEmail"),
          seatMap: data.seatMap,
        },
      });
    } catch (error) {
      console.error("Payment/Booking failed:", error);
      alert("Something went wrong with booking.");
    }
  };

  return (
    <Box p={4} maxWidth={500} mx="auto">
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Card Number"
          fullWidth
          margin="normal"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <TextField
          label="Expiry Date (MM/YY)"
          fullWidth
          margin="normal"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <TextField
          label="CVV"
          fullWidth
          margin="normal"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
          Confirm and Pay
        </Button>
      </form>
    </Box>
  );
};

export default Payment;
