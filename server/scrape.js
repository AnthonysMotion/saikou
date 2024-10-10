const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://ww8.gogoanimes.org/anime-list';  // Replace with the actual URL you want to scrape

async function scrapeAnime() {
  try {
    const { data } = await axios.get(url);  // Fetch HTML content
    const $ = cheerio.load(data);  // Load the HTML into Cheerio

    const animeList = [];

    // Extract anime names and URLs
    $('.anime_list_body ul.listing li').each((index, element) => {
        const animeElement = $(element).find('a');
        const name = animeElement.text().trim();
        let href = animeElement.attr('href');
    
        // Remove the "/category/" part from the href
        if (href.startsWith('/category/')) {
        href = href.replace('/category/', '');  // Remove the "/category/" part
        }
    
        animeList.push({
        name,
        url: href,  // Now it will be just "one-piece" instead of "/category/one-piece"
        });
    });
    

    return animeList;  // Return the list of anime
  } catch (error) {
    console.error('Error scraping anime data:', error);
    throw error;  // Throw error if scraping fails
  }
}

module.exports = scrapeAnime;  // Export the function
