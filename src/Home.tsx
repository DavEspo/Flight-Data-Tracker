import React from "react";
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/Login")
    };
    const goToSignup = () => {
        navigate("/Signup")
    };
    return (
        <>
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={goToLogin}
            >
                Login
            </Button>
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={goToSignup}
            >
                Signup
            </Button>
        </>
    )
}

export default Home;