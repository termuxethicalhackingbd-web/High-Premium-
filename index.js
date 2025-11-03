
// 🌌 Galaxy Jackpot Bot — Server Configuration
import express from "express";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const app = express();

// Optional: allow JSON requests
app.use(express.json());

// --- Basic Route ---
app.get("/", (req, res) => {
  res.send("🌌 Galaxy Jackpot Bot Server is Running Successfully...");
});

// --- API Route to Check .env Data ---
app.get("/config", (req, res) => {
  res.json({
    project: process.env.PROJECT_NAME,
    creator: process.env.CREATOR_NAME,
    admin_id: process.env.ADMIN_ID,
    referral_bonus: process.env.REFERRAL_BONUS,
    referral_commission: process.env.REFERRAL_COMMISSION,
    withdraw_methods: process.env.WITHDRAW_METHODS,
    default_mode: process.env.DEFAULT_MODE,
    ads_enabled: process.env.ENABLE_ADS,
  });
});

// --- Example: Database API route (for later use) ---
app.get("/api/database", (req, res) => {
  res.json({ message: "Database API Connected ✅" });
});

// --- Example: Ads tracking API route ---
app.get("/api/ads", (req, res) => {
  res.json({ message: "Ads Tracking API Active ✅" });
});

// --- Example: Withdraw log API route ---
app.get("/api/withdraw", (req, res) => {
  res.json({ message: "Withdraw Log API Ready ✅" });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at: http://localhost:${PORT}`);
});
