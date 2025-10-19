// Run locally: npm install node-ssdp upnp-mediarenderer-client node-fetch@2
import fetch from "node-fetch";
import Ssdp from "node-ssdp";
import MediaRendererClient from "upnp-mediarenderer-client";

const VERCEL_URL = "https://yourapp.vercel.app"; // change to your domain

let tvUrl = null;

// Discover Samsung TV (DLNA)
console.log("🔍 Searching for Samsung TV...");
const ssdp = new Ssdp.Client();
ssdp.on("response", (headers, code, rinfo) => {
  if (headers.ST?.includes("MediaRenderer")) {
    tvUrl = `http://${rinfo.address}:9197/dmr`; // typical Samsung port
    console.log("✅ Found TV:", tvUrl);
  }
});
ssdp.search("urn:schemas-upnp-org:device:MediaRenderer:1");

// Poll every 5s for new song
setInterval(async () => {
  if (!tvUrl) return;
  try {
    const res = await fetch(`${VERCEL_URL}/api/poll`);
    const song = (await res.text()).trim();
    if (song) {
      console.log("🎵 New song:", song);
      const device = new MediaRendererClient(tvUrl);
      device.load(song, { autoplay: true, metadata: { title: "From Website" } },
        err => err ? console.error("❌ Error:", err) : console.log("▶️ Playing on TV!"));
    }
  } catch (e) {
    console.error("Poll failed:", e);
  }
}, 5000);
