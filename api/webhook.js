// api/webhook.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const body = req.body;
    const TELE_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ADMIN_ID = process.env.ADMIN_ID;
    if (!body.message) return res.status(200).end();

    const msg = body.message;
    const chatId = msg.chat.id;
    const txt = (msg.text || "").trim();

    // handle /start
    if (txt && txt.startsWith("/start")) {
      const name = (msg.from && (msg.from.first_name || msg.from.username)) || "Player";
      const webappUrl = (process.env.WEBAPP_URL || "") + `?start=${chatId}`;
      const payload = {
        chat_id: chatId,
        text: `✨ স্বাগতম ${name}! Open WebApp to start playing.`,
        reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "🎮 Open WebApp", web_app: { url: webappUrl } }]] })
      };
      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    }

    // optionally notify admin on every message
    if (ADMIN_ID && TELE_TOKEN) {
      const note = `💬 Message from ${msg.from.username || msg.from.first_name || chatId} (${chatId}): ${txt}`;
      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: ADMIN_ID, text: note }) });
    }

    return res.status(200).json({ ok:true });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}
