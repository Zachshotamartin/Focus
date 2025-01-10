const express = require("express");
const app = express();

const router = express.Router();
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT
);

router.get("/", async (req, res, next) => {
  const code = req.query.code;
  try {
    const oAuth2Client = new OAuth2Client({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT,
    });
    const res = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(res.tokens);
    console.log("Tokens", res.tokens);
    const user = oAuth2Client.crendentials;
    console.log("credentials", user);
    await getUserData(user.access_token);
  } catch (error) {
    console.log("Error", error);
  }
});

module.exports = router;
