import { LockOutlined } from "@mui/icons-material";
import {
    Container,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                email,
                password,
            });
            
            console.log("Login successful:", response.data.message);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email
            }));
            localStorage.setItem("userEmail", email);
            navigate("/Dashboard");
        } catch (error: any) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };
    

    return (
        <>
            <Container maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                    }}
                >
                    <Button variant="outlined" size="small" onClick={() => navigate("/")}>
                        Home
                    </Button>
                </Box>

                <Box
                    sx={{
                        mt: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>

                        <Grid container justifyContent={"flex-end"}>
                            <Grid>
                                <Link to="/Signup">Don't have an account? Signup</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
