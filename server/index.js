const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT
);

// Add middleware to parse incoming JSON requests
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  methods: ["GET", "POST", "OPTIONS", "DELETE"], // Add DELETE to allowed methods
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.get("/login", (req, res) => {
  const redirectUri = process.env.REDIRECT;
  const clientId = process.env.CLIENT_ID;

  const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20https://www.googleapis.com/auth/calendar`;
  res.redirect(loginUrl);
});

app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No authorization code provided");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;

    // Redirect back to the frontend with the token
    res.redirect(`http://localhost:5173/auth?token=${accessToken}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/calendar", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("No token provided");
  }

  try {
    const calendarResponse = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!calendarResponse.data || !calendarResponse.data.items) {
      throw new Error("No calendar events found");
    }

    res.json(calendarResponse.data);
  } catch (error) {
    console.error("Error fetching calendar events:", error.message);
    res.status(500).send({
      error: "Error fetching calendar events",
      details: error.message,
    });
  }
});

app.post("/calendar/event", async (req, res) => {
  const { eventDetails } = req.body;
  const token = req.headers.authorization;
  console.log("token", token);
  console.log("eventDetails", eventDetails);
  if (!token || !eventDetails) {
    return res.status(400).send("Missing token or event details");
  }

  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      eventDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response.data);
    res.status(200).send({ success: true, event: response.data });
  } catch (error) {
    console.error("Error adding event:", error.response?.data || error.message);
    res.status(500).send({
      error: "Failed to add event",
      details: error.response?.data || error.message,
    });
  }
});

app.post("/calendar/quickadd", async (req, res) => {
  const { text } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!text || !token) {
    return res.status(400).send("Missing event text or token");
  }

  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events/quickAdd",
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).send({ success: true, event: response.data });
  } catch (error) {
    console.error("Error in Quick Add:", error.response?.data || error.message);
    res.status(500).send({
      error: "Failed to add event via Quick Add",
      details: error.response?.data || error.message,
    });
  }
});

app.delete("/calendar/event/:eventId", async (req, res) => {
  console.log("hello");
  const eventId = req.params.eventId;

  console.log("testing", eventId);
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer token
  console.log("token", token);
  if (!token) {
    return res.status(401).send("Missing or invalid token");
  }

  try {
    // Call the Google Calendar API to delete the event
    const response = await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res
      .status(200)
      .send({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error(
      "Error deleting event:",
      error.response?.data || error.message
    );
    res.status(500).send({
      error: "Failed to delete event",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));
