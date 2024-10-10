const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');  // Import the CORS middleware
const app = express();
const PORT = 5000;

// Enable CORS for all origins (or specify the exact origin)
app.use(cors()); // This allows all origins, for more strict control use: `app.use(cors({ origin: 'http://localhost:3000' }))`

// An array to store scraped anime list
let animeList = [];

// Function to scrape anime list from a given page
const scrapeAnimeList = async (pageNumber) => {
  const url = `https://ww8.gogoanimes.org/anime-list?page=${pageNumber}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('.anime_list_body ul.listing li').each((index, element) => {
      const animeElement = $(element).find('a');
      const name = animeElement.text().trim();
      const href = animeElement.attr('href').replace('/category/', ''); // Remove "/category/"
      animeList.push({ name, url: href });
    });
    console.log(`Scraped page ${pageNumber}`);
  } catch (error) {
    console.error('Error scraping anime list:', error);
  }
};

// Scrape anime list from multiple pages (up to 10 pages)
const scrapeAllPages = async () => {
  const totalPages = 10; // Assume 10 pages max, update as needed
  for (let page = 1; page <= totalPages; page++) {
    await scrapeAnimeList(page);
  }
};

// Scrape all pages on startup
scrapeAllPages();

// API to get paginated anime list
app.get('/api/anime-list', (req, res) => {
  const { page = 1 } = req.query; // Page number from query string
  const itemsPerPage = 40;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedAnimeList = animeList.slice(startIndex, startIndex + itemsPerPage);
  res.json(paginatedAnimeList);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
