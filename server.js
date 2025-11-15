import express from "express";
import fetch from "node-fetch"; // if Node 18+, built-in fetch works

const app = express();
app.use(express.json());

// ✅ Replace with your real Discord webhook URL
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/XXXXXXXXXXXX/XXXXXXXXXXXX";

app.post("/send-to-discord", async (req, res) => {
  try {
    const { playerName, discordTag, email, planName, price } = req.body;

    const embed = {
      username: "Payment Bot",
      embeds: [
        {
          title: "💳 New Payment Started",
          color: 0x00ff99,
          fields: [
            { name: "Player Name", value: playerName || "Unknown", inline: true },
            { name: "Discord", value: discordTag || "Unknown", inline: true },
            { name: "Email", value: email || "N/A", inline: false },
            { name: "Plan", value: planName || "N/A", inline: true },
            { name: "Price", value: `$${price}`, inline: true },
          ],
          footer: { text: "TonleHosting Payments" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });

    if (!response.ok) throw new Error(`Discord error: ${response.statusText}`);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error sending to Discord:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
