const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://ww8.gogoanimes.org/anime-list';  // Replace with the actual URL you want to scrape

let animeList = [];  // Make sure this is declared at the top level

async function scrapeAnime() {
  try {
    const { data } = await axios.get(url);  // Fetch HTML content
    const $ = cheerio.load(data);  // Load the HTML into Cheerio

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

// Function to scrape anime data from a specific page
async function scrapeAnimePage(pageNumber) {
    try {
      const { data } = await axios.get(`https://ww8.gogoanimes.org/anime-list?page=${pageNumber}`);
      const $ = cheerio.load(data);
  
      // Extract anime names and URLs
      $('.anime_list_body ul.listing li').each((index, element) => {
        const animeElement = $(element).find('a');
        const name = animeElement.text().trim();
        let href = animeElement.attr('href');
  
        // Clean up the href if necessary
        href = href.replace('/category/', '');
  
        // Add anime to the list
        animeList.push({
          name,
          url: href,  // Use relative URL
        });
      });
  
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
    }
  }
  
  // Function to scrape all pages (until no more pages are found)
  async function scrapeAllAnime() {
    let pageNumber = 1;
    let hasMorePages = true;
  
    while (hasMorePages) {
      console.log(`Scraping page ${pageNumber}...`);
      await scrapeAnimePage(pageNumber);
  
      // Check if there are more pages by inspecting the last page button or link
      const { data } = await axios.get(`https://ww8.gogoanimes.org/anime-list?page=${pageNumber}`);
      const $ = cheerio.load(data);
  
      // Check if there's a "Next" button, indicating more pages
      const nextPageButton = $('.pagination a.next');  // Adjust this selector if necessary
      if (!nextPageButton.length) {
        hasMorePages = false;  // No more pages, stop scraping
      } else {
        pageNumber += 1;  // Move to the next page
      }
    }
  
    console.log('Scraping complete. Anime list:', animeList);
  }

async function scrapeAnimeList(pageNumber) {
    const animeList = [];
    try {
      const { data } = await axios.get(`https://ww8.gogoanimes.org/anime-list?page=${pageNumber}`);
      const $ = cheerio.load(data);
  
      $('.anime_list_body ul.listing li').each((index, element) => {
        const animeElement = $(element).find('a');
        const name = animeElement.text().trim();
        const href = animeElement.attr('href').replace('/category/', '');  // Strip '/category/'
  
        animeList.push({
          name,
          url: href,
        });
      });
    } catch (error) {
      console.error(`Error fetching anime data from page ${pageNumber}:`, error);
    }
  
    return animeList;
  }
  

scrapeAllAnime();
module.exports = scrapeAnime;  // Export the function
module.exports = scrapeAnimeList;
