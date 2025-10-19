// local-tv.js
import fetch from "node-fetch";
import Ssdp from "node-ssdp";
import MediaRendererClient from "upnp-mediarenderer-client";

const VERCEL_URL = "https://tvcast.vercel.app"; // change to your domain
let tvUrl = null;

// Discover Samsung TV via DLNA
console.log("🔍 Searching for Samsung TV...");
const ssdp = new Ssdp.Client();
ssdp.on("response", (headers, code, rinfo) => {
  if (headers.ST?.includes("MediaRenderer")) {
    tvUrl = `http://${rinfo.address}:9197/dmr`;
    console.log("✅ Found TV:", tvUrl);
  }
});
ssdp.search("urn:schemas-upnp-org:device:MediaRenderer:1");

// TV heartbeat (auto-pair signal)
setInterval(async () => {
  if (!tvUrl) return;
  await fetch(`${VERCEL_URL}/api?ping=tv`);
}, 5000);

// Poll for song commands
setInterval(async () => {
  if (!tvUrl) return;
  const res = await fetch(`${VERCEL_URL}/api/poll`);
  const song = (await res.text()).trim();
  if (song) {
    console.log("🎵 New Song:", song);
    const client = new MediaRendererClient(tvUrl);
    client.load(song, { autoplay: true }, err => {
      if (err) console.error("❌ Error:", err);
      else console.log("▶️ Playing on TV");
    });
  }
}, 5000);
