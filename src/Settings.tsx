import { Box, Button, Typography } from "@mui/material";

const Settings = () => {
  const userEmail = localStorage.getItem("userEmail");
  console.log("Loaded userEmail from localStorage:", userEmail);
  
  const handleDelete = async () => {
    if (!userEmail) {
      alert("User not logged in");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      console.log("Attempting to delete:", userEmail);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        localStorage.removeItem("userEmail");
        window.location.href = "/";
      } else {
        alert(`Failed to delete account: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting account.");
    }
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {userEmail ? (
        <Typography variant="subtitle1" gutterBottom>
          Logged in as: {userEmail}
        </Typography>
      ) : (
        <Typography variant="subtitle1" gutterBottom color="error">
          You are not logged in.
        </Typography>
      )}

      <Button
        variant="contained"
        color="error"
        onClick={handleDelete}
        sx={{ mt: 4 }}
      >
        Delete Account
      </Button>
      
      <Button
        variant="outlined"
        color="primary"
        onClick={() => window.location.href = "/dashboard"}
        sx={{ mt: 2 }}
        >
        Back to Dashboard
        </Button>

    </Box>
  );
};

export default Settings;
