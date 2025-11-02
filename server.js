import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const BOT_TOKEN = "8476734737:AAEOORZ-iBbRXcL_AO3sz4wlPBtdQKJILn0";
const ADMIN_ID = "6209706593";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzRVNltwIi_q6Mgc_UKMQGQf2YTm5WRBtrCL-FlJtIUp57rv0LGoNOPnG7BhDeW7O8-/exec";

// Telegram API base
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// --- WebApp Route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Telegram Bot ---
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg || !msg.text) return res.sendStatus(200);

    const chatId = msg.chat.id;
    const name = msg.from.first_name;

    if (msg.text === "/start") {
      const welcomeMsg = `🌟 Welcome ${name}!\n\n🎯 Use USA VPN before using this bot.\n\n💰 Earn more from ads, tasks & games!`;
      await sendMessage(chatId, welcomeMsg);
      setTimeout(() => deleteMessage(chatId, msg.message_id + 1), 6000);
    }

    // Log user in Google Sheet
    await fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify({
        user_id: chatId,
        username: name,
        action: msg.text,
        status: "Active"
      }),
      headers: { "Content-Type": "application/json" },
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.sendStatus(500);
  }
});

// --- Telegram Message Helper ---
async function sendMessage(chatId, text) {
  await fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function deleteMessage(chatId, messageId) {
  await fetch(`${API_URL}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
}

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
