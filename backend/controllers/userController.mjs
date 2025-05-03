// controllers/userController.mjs
import * as userService from '../services/userService.mjs';

export async function deleteUser(req, res) {
  const email = req.params.email;
  console.log("Deleting user with email:", email);

  try {
    await userService.deleteUser(email);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
