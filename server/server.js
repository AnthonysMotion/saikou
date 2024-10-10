const express = require('express');
const cors = require('cors');
const scrapeAnimeList = require('./scrape');  // Import updated scraper

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Route for scraping the list of anime
app.get('/api/anime', async (req, res) => {
  try {
    const animeList = await scrapeAnimeList();  // Get all anime across all pages
    res.json(animeList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching anime list' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
