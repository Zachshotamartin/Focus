const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { OAuth2Client } = require("google-auth-library");
const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT
);

const router = express.Router();
router.get("/", async (req, res) => {
  res.send("Hello");
});
router.post("/oauth", async (req, res) => {
  try {
    // get the code from frontend
    const code = req.headers.authorization;
    console.log("Authorization Code:", code);

    // Exchange the authorization code for an access token
    const tokenResponse = await oauth2Client.getToken(code);
    const accessToken = tokenResponse.tokens.access_token;
    console.log("Access Token:", accessToken);

    // Fetch user details using the access token
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userDetails = userResponse.data;
    console.log("User Details:", userDetails);

    // Process user details and perform necessary actions

    res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ message: "Error authenticating user" });
  }
});

module.exports = router;
