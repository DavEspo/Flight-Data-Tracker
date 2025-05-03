import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    Typography,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AccountCircle from "@mui/icons-material/AccountCircle";

function Dashboard() {
    console.log("Loaded userEmail from localStorage:", localStorage.getItem("userEmail"));

    const navigate = useNavigate();

    const [tripType, setTripType] = useState("one-way");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState<Dayjs>(dayjs());
    const [returnDate, setReturnDate] = useState<Dayjs>(dayjs());
    
    const [adults, setAdults] = useState(1);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const isSearchDisabled = !origin || !destination || !departureDate || (tripType === "round-trip" && !returnDate);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) navigate("/login");
    }, []);
      

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewBookings = () => {
        handleMenuClose();
        navigate("/bookings");
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate("/settings");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        handleMenuClose();
        navigate("/login");
    };
    

    const handleSearch = () => {
        const params = new URLSearchParams({
            origin,
            destination,
            departureDate: departureDate.format("YYYY-MM-DD"),
            ...(tripType === "round-trip" && { returnDate: returnDate.format("YYYY-MM-DD") }),
            adults: adults.toString(),
        });

        navigate(`/flights?${params.toString()}`, { state: { adults } });

        console.log(params.toString());

    };

    return (
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppBar position="static" sx={{ mb: 3 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuOpen}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem onClick={handleViewBookings}>View Bookings</MenuItem>
                        <MenuItem onClick={handleSettings}>Settings</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Trip Type</InputLabel>
                    <Select
                        value={tripType}
                        label="Trip Type"
                        onChange={(e) => setTripType(e.target.value)}
                    >
                        <MenuItem value="one-way">One-way</MenuItem>
                        <MenuItem value="round-trip">Round-trip</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="From (Airport Code, e.g. JFK)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="To (Airport Code, e.g. LAX)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                    sx={{ mb: 2 }}
                />

                <DatePicker<Dayjs>
                    label="Departure Date"
                    value={departureDate}
                    onChange={(newValue) => {
                        if (newValue) setDepartureDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
                />

                {tripType === "round-trip" && (
                    <DatePicker<Dayjs>
                        label="Return Date"
                        value={returnDate}
                        onChange={(newValue) => {
                            if (newValue) setReturnDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
                />
                )}

                <TextField
                    fullWidth
                    label="Number of Adults"
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    sx={{ mb: 2 }}
                />

                <Button variant="contained" onClick={handleSearch} disabled={isSearchDisabled}>
                    Search Flights
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default Dashboard;
