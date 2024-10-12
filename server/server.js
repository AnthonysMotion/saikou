const express = require('express');
const cors = require('cors');
const { scrapeAllPages, scrapeAnimeDetails, scrapeEpisodeIframe, animeList } = require('./scrape');  // Import scrape functions
const app = express();
const PORT = 5000;
const axios = require('axios');
const cheerio = require('cheerio');

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

app.get('/api/anime/episode/:animeName/:episodeNumber', async (req, res) => {
  const { animeName, episodeNumber } = req.params;
  // Update the URL to the new site
  const url = `https://ww1.9anime2.com/watch/${animeName}/${episodeNumber}`;

  console.log(`Scraping URL: ${url}`); // Log the URL being scraped

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Find the iframe source URL using the new ID selector
    var iframeSrc = $('#playerframe').attr('src'); // Change the selector to match the new site's iframe

    console.log(`Found iframe: ${iframeSrc}`); // Log the found iframe URL
    if (iframeSrc.startsWith('/embed/')) {
      iframeSrc = `https://ww1.9anime2.com${iframeSrc}`;
    }
    console.log(`Updated iframe: ${iframeSrc}`);

    if (iframeSrc) {
      res.json({ iframe: iframeSrc });
    } else {
      console.log('Iframe not found in HTML');
      res.status(404).json({ error: 'Iframe not found' });
    }
  } catch (error) {
    console.error('Error scraping the page:', error);
    res.status(500).json({ error: 'Failed to fetch episode details' });
  }
});




// Start the server and scrape all anime list pages
scrapeAllPages().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
