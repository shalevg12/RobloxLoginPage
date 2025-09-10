export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const { usernameMasked, submittedAt } = req.body || {};
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token)  return res.status(500).json({ ok:false, error:"Missing TELEGRAM_BOT_TOKEN" });
    if (!chatId) return res.status(500).json({ ok:false, error:"Missing TELEGRAM_CHAT_ID" });

    const text =
      `🔔 Demo login submit\n` +
      `• Username (masked): ${usernameMasked}\n` +
      `• Time: ${submittedAt}\n` +
      `*(No password collected)*`;

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const r = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: Number(chatId), text }),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => String(r.status));
      return res.status(500).json({ ok:false, error:`Telegram ${r.status}: ${t}` });
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok:false, error: String(e?.message || e) });
  }
}
