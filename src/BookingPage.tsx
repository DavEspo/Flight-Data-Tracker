import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import SeatMap from "./SeatMap";

type Flight = {
  id: string;
};

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, seatAvailability, adults } = location.state as { flight: Flight; seatAvailability: string[][]; adults: number };
  const rows = seatAvailability.length;
  const cols = seatAvailability[0]?.length || 0;

  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatSelectionError, setSeatSelectionError] = useState(false);

  const [currentTravelerIndex, setCurrentTravelerIndex] = useState(0);

  type Traveler = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    passportNumber: string;
  };
  
  const [travelers, setTravelers] = useState<Traveler[]>(() =>
    Array.from({ length: adults }, () => ({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      passportNumber: "",
    }))
  );  
  
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTravelers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value } as Traveler;
      return updated;
    });
  };
  

  const handleSeatSelect = (seats: string[]) => {
    if (seats.length > adults) {
      alert(`You can only select ${adults} seats.`);
      return;
    }
    
    setSelectedSeats(seats);
  
    // Only update currentTravelerIndex if seats.length < adults
    if (seats.length <= adults) {
      setCurrentTravelerIndex(seats.length);
    }
  };
  
  
  const handleSubmit = () => {
    const requiredFields = ["firstName", "lastName", "dateOfBirth", "gender", "email", "phone", "passportNumber"];
    const allFilled = travelers.every(traveler =>
      requiredFields.every(field => traveler[field as keyof typeof traveler]?.trim() !== "")
    );

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("User not logged in");
      return;
    }

    if (selectedSeats.length !== adults) {
      setSeatSelectionError(true);
      return;
    }

    if (!allFilled) {
      alert("Please complete all fields for all travelers before proceeding.");
      return;
    }

    navigate("/payment", {
      state: {
        flight,
        travelers,
        selectedSeats,
      },
    });
    
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setTravelers((prev) =>
        prev.map((traveler, index) => {
          if (index === 0) {
            return {
              ...traveler,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
            };
          }
          return traveler;
        })
      );
    }
  }, []);

  if (!flight) return <Typography>No flight selected</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>Enter Traveler Information</Typography>

        {travelers.map((traveler, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Traveler {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={traveler.firstName}
                    InputProps={index === 0 ? { readOnly: true } : undefined}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={traveler.lastName}
                    InputProps={index === 0 ? { readOnly: true } : undefined}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={traveler.dateOfBirth}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="gender"
                    label="Gender (MALE/FEMALE)"
                    fullWidth
                    value={traveler.gender}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={traveler.email}
                    InputProps={index === 0 ? { readOnly: true } : undefined}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    value={traveler.phone}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="passportNumber"
                    label="Passport / ID Number"
                    fullWidth
                    value={traveler.passportNumber}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        {seatSelectionError && (
          <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
            Please select all seats for your booking.
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "gray" }}>
          Click to select a seat and click again to deselect.
        </Typography>

        <Box mt={4}>
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          {currentTravelerIndex < adults
            ? `Select seat for Traveler ${currentTravelerIndex + 1}`
            : "All travelers have selected seats."}
        </Typography>

          <Typography variant="h6" gutterBottom>Select Your Seat</Typography>
          {flight.id && seatAvailability && (
            <SeatMap
              rows={rows}
              cols={cols}
              seatAvailability={seatAvailability}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              isReadOnly={false}
            />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Proceeding..." : "Proceed to Payment"}
        </Button>
      </Paper>
    </Box>
  );
}

export default BookingPage;
