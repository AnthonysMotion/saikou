const axios = require('axios');
const cheerio = require('cheerio');

// Base URL for the site
const baseUrl = 'https://ww8.gogoanimes.org';

// Array to store anime list globally
let animeList = [];

// Function to scrape anime list from a given page
const scrapeAnimeList = async (pageNumber) => {
  const url = `${baseUrl}/anime-list?page=${pageNumber}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Scrape the anime list from the webpage
    $('.anime_list_body ul.listing li').each((index, element) => {
      const animeElement = $(element).find('a');
      const name = animeElement.text().trim();
      const href = animeElement.attr('href').replace('/category/', '');  // Remove "/category/"
      animeList.push({ name, url: href });
    });
    console.log(`Scraped page ${pageNumber}`);
  } catch (error) {
    console.error('Error scraping anime list:', error);
  }
};

// Function to scrape additional details of a specific anime
const scrapeAnimeDetails = async (animeUrl) => {
    // Construct the correct URL with '/category/' path
    const animeDetailsUrl = `https://ww8.gogoanimes.org/category/${animeUrl}`;
    
    try {
      const { data } = await axios.get(animeDetailsUrl);
      const $ = cheerio.load(data);
  
      // Scrape the details of the anime from the page
      const description = $('div.anime_info_body p').first().text().trim();  // Description is a string
      const image = $('div.anime_info_body img').attr('src');  // Grab the image source URL
      const episodes = $('div.anime_info_body').find('a[href^="/episode"]').length;  // Count the number of episodes
  
      return { description, image, episodes };
    } catch (error) {
      console.error('Error scraping anime details:', error);
      return null;
    }
  };
  
  

// Scrape all anime list pages (up to 247 pages)
const scrapeAllPages = async () => {
  const totalPages = 247;  // Adjust this if necessary
  for (let page = 1; page <= totalPages; page++) {
    await scrapeAnimeList(page);
  }
};

module.exports = { scrapeAnimeList, scrapeAnimeDetails, scrapeAllPages, animeList };
