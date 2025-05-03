// services/userService.mjs
import db from '../db/db.mjs';

export const deleteUser = async (email) => {
  const [result] = await db.execute('DELETE FROM users WHERE email = ?', [email]);
  console.log("Delete result:", result);
  if (result.affectedRows === 0) {
    throw new Error("No user found with the given email");
  }
};
