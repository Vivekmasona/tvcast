// api/index.js
let latestSong = "";
let tvOnline = false;

export default async function handler(req, res) {
  const { url, ping } = req.query;

  // TV ping (heartbeat)
  if (ping === "tv") {
    tvOnline = true;
    setTimeout(() => (tvOnline = false), 10000); // 10s timeout
    return res.status(200).send("✅ TV online");
  }

  // Song play request
  if (req.url.startsWith("/api/play")) {
    if (!tvOnline) return res.status(400).send("❌ No TV connected");
    latestSong = url || "";
    return res.status(200).send("🎶 Song sent to TV");
  }

  // Poll for song on TV side
  if (req.url.startsWith("/api/poll")) {
    const song = latestSong;
    latestSong = "";
    return res.status(200).send(song);
  }

  // Status check
  if (req.url.startsWith("/api/status")) {
    return res.status(200).send(tvOnline ? "online" : "offline");
  }

  res.status(200).send("Samsung TV Auto Pair API Running");
}
