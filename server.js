import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());

const BOT_TOKEN = "8476734737:AAEOORZ-iBbRXcL_AO3sz4wlPBtdQKJILn0";
const ADMIN_ID = "6209706593";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzRVNltwIi_q6Mgc_UKMQGQf2YTm5WRBtrCL-FlJtIUp57rv0LGoNOPnG7BhDeW7O8-/exec";

// ✅ Telegram Webhook
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const name = msg.from.first_name || "User";

  if (msg.text === "/start") {
    const text = `✨ Welcome ${name}!\n\nPlease wait while we load your dashboard...`;
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [{ text: "🚀 Open Galaxy WebApp", web_app: { url: "https://your-vercel-url.vercel.app/?name=" + encodeURIComponent(name) } }],
          ],
        },
      }),
    });
  }

  res.sendStatus(200);
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🌌 Galaxy Jackpot Bot Running...");
});

app.listen(3000, () => console.log("Bot server started"));
