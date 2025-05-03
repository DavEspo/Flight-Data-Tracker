import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            setError("");

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
                firstName,
                lastName,
                email,
                password,
            });
            
            if (response.status === 200) {
                console.log("User signed up successfully:", response.data);
                navigate("/Dashboard");
            } else {
                console.error("Signup failed:", response.data.message);
                setError(response.data.message || "An unknown error occurred.");
            }
        } catch (error: any) {
            console.error("There was an error signing up:", error);
            setError("Error: " + (error?.response?.data?.message || "Network Error"));
        }
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => navigate("/")}>
                    Home
                </Button>
            </Box>

            <Box sx={{
                mt: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                
                <Typography variant="h5">Signup</Typography>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            name="firstName"
                            required
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="lastName"
                            required
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSignup}
                    >
                        Signup
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login">Already have an account? Login</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;