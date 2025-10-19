// api/index.js
let latestSong = "";

export default async function handler(req, res) {
  const { url } = req.query;

  if (req.url.startsWith("/api/play")) {
    latestSong = url || "";
    return res.status(200).send("✅ Song command saved");
  }

  if (req.url.startsWith("/api/poll")) {
    const cmd = latestSong;
    latestSong = "";
    return res.status(200).send(cmd);
  }

  res.status(200).send("🎵 Samsung TV Cast API Running");
}
