import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Box, Button, Card, CardContent,
  Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import SeatMap from "./SeatMap";

function FlightsAvailable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("price");
  const [visibleSeatMapId, setVisibleSeatMapId] = useState<string | null>(null);
  const [seatAvailabilityMap, setSeatAvailabilityMap] = useState<Record<string, string[][]>>({});
  const [selectedSeatsMap, setSelectedSeatsMap] = useState<Record<string, string[]>>({});

  const location = useLocation()
  const { adults } = location.state as { adults: number };

  type FlightOffer = {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: {
      duration: string;
      segments: Segment[];
    }[];
    price: { currency: string; total: string };
    current_price?: string;
    base_price?: string;
    validatingAirlineCodes: string[];
    travelerPricings: any[];
  };
  

  type Segment = {
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    duration: string;
  };

  const airlineMap: Record<string, string> = {
    AA: "American Airlines", AC: "Air Canada", AF: "Air France", AI: "Air India",
    AM: "Aeroméxico", AS: "Alaska Airlines", AZ: "ITA Airways", BA: "British Airways",
    B6: "JetBlue Airways", BR: "EVA Air", CA: "Air China", CI: "China Airlines",
  };

  const generateRandomSeatMap = (rows: number, cols: number): string[][] => {
    return Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).map(() => (Math.random() < 0.7 ? "available" : "reserved"))
    );
  };

  const handleViewSeatMap = (flightId: string) => {
    makeSeatMap(flightId)
    setVisibleSeatMapId(visibleSeatMapId === flightId ? null : flightId);
  };

  const makeSeatMap = (flightId: string) => {
    if (!seatAvailabilityMap[flightId]) {
        const newSeatMap = generateRandomSeatMap(30, 6);
        setSeatAvailabilityMap((prev) => ({ ...prev, [flightId]: newSeatMap }));
      }
  }
  
  const handleSeatSelect = (flightId: string, selectedSeats: string[]) => {
    setSelectedSeatsMap((prev) => ({ ...prev, [flightId]: selectedSeats }));
    console.log("Selected Seats: ", selectedSeats);
  };
  
  const formatDuration = (durationStr: string) => {
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return "N/A";
    const hours = match[1] ? `${match[1]}h` : "";
    const minutes = match[2] ? `${match[2]}m` : "";
    return `${hours} ${minutes}`.trim();
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          origin: searchParams.get("origin") || "",
          destination: searchParams.get("destination") || "",
          departureDate: searchParams.get("departureDate") || "",
          returnDate: searchParams.get("returnDate") || "",
          adults: searchParams.get("adults") || "1",
        });

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search-flights?${params.toString()}`);
        const data = await response.json();
        console.log("🎯 Flight data received:", data);
        setFlights(data.data || []);
      } catch (err) {
        console.error("Failed to fetch flights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  const handleBookNow = (flightId: string, flight: FlightOffer) => {
    if (!seatAvailabilityMap[flightId]) {
      const newSeatMap = generateRandomSeatMap(30, 6);
      setSeatAvailabilityMap(prev => ({ ...prev, [flightId]: newSeatMap }));
      navigate("/booking", {
        state: { flight, seatAvailability: newSeatMap, adults }
      });
    } else {
      navigate("/booking", {
        state: { flight, seatAvailability: seatAvailabilityMap[flightId], adults }
      });
    }
  };
  
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortOption === "price") {
        const aPrice = parseFloat(a.current_price || a.base_price || a.price.total);
        const bPrice = parseFloat(b.current_price || b.base_price || b.price.total);
        return aPrice - bPrice;
        
    } else if (sortOption === "duration") {
      const getMinutes = (duration: string) => {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const hours = parseInt(match?.[1] || "0", 10);
        const minutes = parseInt(match?.[2] || "0", 10);
        return hours * 60 + minutes;
      };

      const aDuration = getMinutes(a.itineraries[0].duration);
      const bDuration = getMinutes(b.itineraries[0].duration);
      return aDuration - bDuration;
    }
    return 0;
  });

  return (
    <Box>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="inherit">✈️ Flight Results</Typography>
          <Button color="primary" variant="outlined" onClick={() => navigate("/dashboard")}>
            Back to Search
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-select"
              value={sortOption}
              label="Sort By"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <MenuItem value="price">Lowest Price</MenuItem>
              <MenuItem value="duration">Shortest Duration</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : sortedFlights.length === 0 ? (
          <Typography>No flights found.</Typography>
        ) : (
          sortedFlights.map((flight) => (
            <Card key={flight.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {flight.itineraries[0]?.segments[0]?.departure?.iataCode} → {flight.itineraries[0]?.segments.slice(-1)[0]?.arrival?.iataCode}
                </Typography>
                <Typography>
                    Price: ${flight.current_price || flight.base_price || flight.price.total} {flight.price.currency}
                </Typography>

                <Typography>
                  Airline: {flight.validatingAirlineCodes.map((code) => airlineMap[code] || code).join(", ")}
                </Typography>
                <Typography>Total Flight Time: {formatDuration(flight.itineraries[0]?.duration)}</Typography>

                {flight.itineraries[0]?.segments.map((segment, segIdx) => (
                  <Box key={segIdx} sx={{ mt: 1, ml: 2 }}>
                    <Typography variant="subtitle2">Segment {segIdx + 1}</Typography>
                    <Typography>
                      {segment.departure.iataCode} ({formatDateTime(segment.departure.at)}) →{" "}
                      {segment.arrival.iataCode} ({formatDateTime(segment.arrival.at)})
                    </Typography>
                    <Typography>Duration: {formatDuration(segment.duration)}</Typography>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleViewSeatMap(flight.id)}
                  sx={{ mt: 1, mr: 2 }}
                >
                  {visibleSeatMapId === flight.id ? "Hide Seat Map" : "View Seat Map"}
                </Button>

                {visibleSeatMapId === flight.id && seatAvailabilityMap[flight.id] && (
                  <Box sx={{ mt: 2 }}>
                    <SeatMap
                        rows={30}
                        cols={6}
                        seatAvailability={seatAvailabilityMap[flight.id]}
                        selectedSeats={selectedSeatsMap[flight.id] || []}
                        isReadOnly={true}
                        onSeatSelect={(seats) => handleSeatSelect(flight.id, seats)}
                    />

                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookNow(flight.id, flight)}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}

export default FlightsAvailable;