// api/index.js
let latestSong = "";
let tvs = {}; // { code: { url, lastSeen } }

export default async function handler(req, res) {
  const { code, url, register } = req.query;

  // Register TV
  if (register) {
    tvs[register] = { lastSeen: Date.now() };
    return res.status(200).send("✅ TV registered: " + register);
  }

  // Get latest song for TV
  if (req.url.startsWith("/api/poll") && code) {
    const song = latestSong;
    latestSong = "";
    return res.status(200).send(song);
  }

  // Command to play
  if (req.url.startsWith("/api/play") && code && url) {
    if (!tvs[code]) return res.status(400).send("❌ TV not paired");
    latestSong = url;
    return res.status(200).send("🎶 Sent to TV " + code);
  }

  res.status(200).send("Samsung TV Cast API running");
}
