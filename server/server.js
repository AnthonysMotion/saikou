const express = require('express');
const cors = require('cors');
const { scrapeAllPages, scrapeAnimeDetails, animeList } = require('./scrape');  // Import scrape functions
const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());

// API to get paginated anime list
app.get('/api/anime-list', (req, res) => {
  const { page = 1 } = req.query;  // Default to page 1 if not provided
  const itemsPerPage = 100;  // Number of items per page
  const startIndex = (page - 1) * itemsPerPage;  // Calculate start index
  const paginatedAnimeList = animeList.slice(startIndex, startIndex + itemsPerPage);

  // Return paginated list along with the total number of items
  res.json({
    totalItems: animeList.length,
    paginatedAnimeList,
  });
});

// API to get specific anime details by URL
app.get('/api/anime/:animeName', async (req, res) => {
  const { animeName } = req.params;
  const anime = animeList.find((item) => item.url === animeName);  // Find the anime by URL

  if (anime) {
    console.log("Anime found:", anime);

    // Scrape detailed info for the anime
    const details = await scrapeAnimeDetails(anime.url);
    if (details) {
      // Merge the scraped details with the basic anime info
      const animeDetails = { ...anime, ...details };
      res.json(animeDetails);  // Send back the full anime details as JSON
    } else {
      res.status(404).json({ message: 'Anime details not found' });
    }
  } else {
    console.log("Anime not found:", animeName);
    res.status(404).json({ message: 'Anime not found' });  // Return 404 if not found
  }
});

// Start the server and scrape all anime list pages
scrapeAllPages().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
