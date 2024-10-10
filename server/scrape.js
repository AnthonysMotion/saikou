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
      
      // Avoid adding duplicate anime names
      if (!animeList.some(anime => anime.name === name)) {
        animeList.push({ name, url: href });
      }
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
      const name = $('h1').text().trim();  // Extract the anime name
      const image = $('div.anime_info_body img').attr('src');  // Grab the image source URL
      const type = $('p.type span:contains("Type:")').next().text().trim();  // Get Type
  
      // Scrape the Plot Summary
      const plotSummary = $('p.type span:contains("Plot Summary:")').next().next().text().trim();
  
      // Scrape the genres, which are multiple <a> tags inside the 'Genre:' section
      const genres = [];
      $('p.type span:contains("Genre:")').next().find('a').each((i, el) => {
        genres.push($(el).text().trim());
      });
  
      // Scrape the Released date
      const released = $('p.type span:contains("Released:")').next().text().trim();
  
      // Scrape the Status
      const status = $('p.type span:contains("Status:")').next().text().trim();
  
      // Scrape the total number of episodes (assuming episodes are in <a> tags with href starting with "/episode")
      const episodes = $('div.anime_info_episodes_next').find('input#movie_id').attr('value') === '0' ? 0 : 1;
  
      // Return the scraped anime details
      return {
        name,
        image,
        type,
        plotSummary,
        genres,
        released,
        status,
        episodes
      };
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

  // Return the anime list after scraping all pages
  return animeList;
};

module.exports = { scrapeAnimeList, scrapeAnimeDetails, scrapeAllPages, animeList };
