const axios = require("axios");

exports.getYouTubeResults = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=6&key=${process.env.YOUTUBE_API_KEY}`
    );

    res.json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch YouTube results" });
  }
};
