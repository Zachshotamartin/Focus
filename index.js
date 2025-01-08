import express from "express";
import { pool } from "./database.js";
const app = express();

app.use(express.json());
app.use(express.static("focus/dist"));

const apiUrl = "/api/users";

app.get(apiUrl, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.users LIMIT 1000");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

app.post("/api/users", async (req, res) => {
  const { email, first_name, last_name } = req.body;

  // Check if user exists in database
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  try {
    const result = await pool.query(query);
    console.log("trying");

    if (result.rows.length > 0) {
      // User exists, return error
      res.status(400).json({ error: "User already exists" });
    } else {
      // User does not exist, insert user into database
      const insertQuery = {
        text: "INSERT INTO users (email, first_name, last_name) VALUES ($1, $2, $3)",
        values: [email, first_name, last_name],
      };

      try {
        await pool.query(insertQuery);
        res.json({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function generateToken(userId) {
  // Generate a token using a library like jsonwebtoken
  return "example_token";
}
