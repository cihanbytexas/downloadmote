// pages/api/searchEmoji.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST required" });

  const { search_term, max_show } = req.body;
  if (!search_term) return res.status(400).json({ error: "search_term required" });

  const limit = max_show && !isNaN(max_show) ? parseInt(max_show) : 5;

  try {
    const response = await fetch("https://emoji.gg/api/");
    const emojis = await response.json();

    let found = emojis.filter(e => 
      e.title.toLowerCase().includes(search_term.toLowerCase()) ||
      e.slug.toLowerCase().includes(search_term.toLowerCase())
    );

    found = found.slice(0, limit);

    // Her emojiye direkt indirme linki ekleyelim
    const result = found.map(e => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      download_link: e.image + "?download=true" // tarayıcıda indirilebilir
    }));

    return res.status(200).json({
      total_found: found.length,
      max_show: limit,
      emojis: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
