// local-tv.js
import fetch from "node-fetch";
import Ssdp from "node-ssdp";
import MediaRendererClient from "upnp-mediarenderer-client";

const VERCEL_URL = "https://yourapp.vercel.app"; // change this
const CODE = "1234"; // You can change code anytime

let tvUrl = null;

console.log("🔍 Searching for Samsung TV...");
const ssdp = new Ssdp.Client();
ssdp.on("response", (headers, code, rinfo) => {
  if (headers.ST?.includes("MediaRenderer")) {
    tvUrl = `http://${rinfo.address}:9197/dmr`;
    console.log("✅ Found TV:", tvUrl);
  }
});
ssdp.search("urn:schemas-upnp-org:device:MediaRenderer:1");

// Register this TV on Vercel
await fetch(`${VERCEL_URL}/api?register=${CODE}`);
console.log("📡 Registered with code:", CODE);

// Poll for new song commands
setInterval(async () => {
  if (!tvUrl) return;
  const res = await fetch(`${VERCEL_URL}/api/poll?code=${CODE}`);
  const song = (await res.text()).trim();
  if (song) {
    console.log("🎵 Playing:", song);
    const client = new MediaRendererClient(tvUrl);
    client.load(song, { autoplay: true }, (err) => {
      if (err) console.error("❌ Error:", err);
      else console.log("▶️ Now playing on TV");
    });
  }
}, 5000);
