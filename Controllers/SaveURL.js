import { URLs } from "../Models/url.js";
import { generateShortId } from "../Utils/Keys.js";

export const SaveURL = async (req, res) => {
  try {
    let { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ ok: false, err: "URL is required" });
    }

    // Clean quotes, spaces and leading slashes
    longUrl = longUrl.trim().replace(/^"|"$/g, '');

    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      longUrl = "https://" + longUrl;
    }

    const shortId = generateShortId(7);
    const newURL = new URLs({ longUrl: longUrl, shortId: shortId });
    await newURL.save();

    // Railway dynamic domain generation
    const host = req.get("host");
    const protocol = req.protocol;
    const shortURL = `${protocol}://${host}/${shortId}`;

    return res.status(200).json({
      ok: true,
      shortURL: shortURL,
    });
  } catch (err) {
    console.error("SaveURL Error:", err);
    return res.status(500).json({
      ok: false,
      err: err.message || "Failed to shorten URL",
    });
  }
};