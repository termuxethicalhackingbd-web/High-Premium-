import express from "express";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

const app = express();
app.use(express.json());

// 🔹 তোমার Bot Token আর Admin ID
const BOT_TOKEN = "8476734737:AAEOORZ-iBbRXcL_AO3sz4wlPBtdQKJILn0";
const ADMIN_ID = "6209706593";

// 🔹 Google Sheet Web App URL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzRVNltwIi_q6Mgc_UKMQGQf2YTm5WRBtrCL-FlJtIUp57rv0LGoNOPnG7BhDeW7O8-/exec";

// 🔹 Telegram Bot চালু করা
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// 🌈 ইউজার বট চালু করলে
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || "User";

  // ঝলমলে Welcome মেসেজ
  await bot.sendMessage(
    chatId,
    `✨ <b>Welcome, ${name}!</b>\n\n🪐 You’ve entered <b>Galaxy Jackpot</b>!\n\n🎯 Earn rewards, complete tasks, and win prizes.`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎮 Start Earning", callback_data: "start_earn" },
            { text: "💸 Withdraw", callback_data: "withdraw" },
          ],
          [
            { text: "👫 Refer & Earn", callback_data: "refer" },
            { text: "⚙️ Settings", callback_data: "settings" },
          ],
        ],
      },
    }
  );

  // Google Sheet এ লগ পাঠানো
  await fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: chatId,
      username: name,
      action: "Start Bot",
      amount: "0",
      status: "Active",
    }),
  });

  // নিচের ব্যানার মেসেজ
  setTimeout(() => {
    bot.sendMessage(
      chatId,
      "🌟 <b>Buy Now Galaxy Jackpot Full Script</b>\n📧 termuxethicalhackingbd@gmail.com",
      { parse_mode: "HTML" }
    );
  }, 4000);
});

// 🔹 Ads দেখানোর জন্য ডেমো কমান্ড
bot.onText(/\/ad/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    "🪙 Please wait while loading your reward ad…"
  );

  // এখানে Monetag বা Adstra ads স্ক্রিপ্ট লোড করার জন্য iframe URL দিতে পারো
  await bot.sendMessage(
    chatId,
    "✅ Reward completed! You’ve earned 10 points 🎉"
  );
});

// 🔹 ডিফল্ট callback হ্যান্ডল
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  if (action === "start_earn") {
    await bot.sendMessage(chatId, "🎯 Watch ads or complete tasks to earn!");
  } else if (action === "withdraw") {
    await bot.sendMessage(chatId, "💳 Withdrawal will be available soon!");
  } else if (action === "refer") {
    await bot.sendMessage(
      chatId,
      `👫 Invite your friends!\nYour link: https://t.me/galaxy_jackpot_bot?start=${chatId}`
    );
  } else if (action === "settings") {
    await bot.sendMessage(chatId, "⚙️ Settings panel coming soon!");
  }
});

// 🌍 Web Server
app.get("/", (req, res) => {
  res.send("🚀 Galaxy Jackpot Bot Server Running Successfully!");
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
