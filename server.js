const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/download', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const json = JSON.parse($('script[type="application/ld+json"]').html());
    if (json.video && json.video.contentUrl) {
      return res.json({ videoUrl: json.video.contentUrl });
    }
    res.status(404).json({ error: 'Video not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch error' });
  }
});

app.listen(PORT, () => console.log('Server live on http://localhost:${PORT}'));
