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

const scrapeAnimeDetails = async (animeUrl) => {
  // Construct the correct URL with '/category/' path
  const animeDetailsUrl = `https://ww8.gogoanimes.org/category/${animeUrl}`;

  try {
    const { data } = await axios.get(animeDetailsUrl);
    const $ = cheerio.load(data);

    // Scrape the details of the anime from the page
    const name = $('h1').first().text().trim(); // Extract the anime name from <h1>
    const image = $('div.anime_info_body_bg img').attr('src'); // Grab the image source URL
    const type = $('p.type span:contains("Type:")').next('a').text().trim(); // Get Type

    // Scrape the Plot Summary
    const plotSummary = $('p.type:contains("Plot Summary:")')
      .first() // Get the first <p> element containing "Plot Summary:"
      .html() // Get the HTML content
      .replace(/<span>Plot Summary:<\/span>\s*/, '') // Remove the "Plot Summary:" label and any whitespace
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove remaining HTML tags
      .replace('Plot Summary: ', '')
      .trim(); // Trim any leading or trailing whitespace

    // Scrape the genres, which are multiple <a> tags inside the 'Genre:' section
    const genres = [];
    $('p.type:contains("Genre:")').find('a').each((i, el) => {
      genres.push($(el).text().trim());
    });

    // Scrape the Released date
    const released = $('p.type:contains("Released:")')
      .first() // Get the first <p> element containing "Released:"
      .html() // Get the HTML content
      .replace(/<span>Released:<\/span>\s*/, '') // Remove the "Released:" label and any whitespace
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove remaining HTML tags
      .replace('Released: ', '')
      .trim(); // Trim any leading or trailing whitespace

    // Scrape the Status
    const status = $('p.type:contains("Status:")')
      .first() // Get the first <p> element containing "Status:"
      .html() // Get the HTML content
      .replace(/<span>Status:<\/span>\s*/, '') // Remove the "Status:" label
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove remaining HTML tags
      .replace('Status: ', '')
      .trim(); // Trim any whitespace

    // Scrape the total number of episodes
    const episodes = $('ul#episode_page li a.active').text().trim();
    const episodeCount = episodes.split('-').pop().trim(); // Get the ending number from the range
    const totalEpisodes = parseInt(episodeCount, 10); // Convert to an integer

    // Return the scraped anime details
    return {
      name,
      image,
      type,
      plotSummary,
      genres,
      released,
      status,
      episodes: totalEpisodes || 0, // Total episodes
    };
  } catch (error) {
    console.error('Error scraping anime details:', error);
    return null;
  }
};

// New function to scrape the iframe for a specific episode
const scrapeEpisodeIframe = async (animeUrl, episodeNumber) => {
  // Construct the episode URL for 9anime
  const episodeUrl = `https://ww1.9anime2.com/watch/${animeUrl}/${episodeNumber}`;

  try {
    const { data } = await axios.get(episodeUrl);
    const $ = cheerio.load(data);

    // Extract the iframe src from the HTML structure
    const iframeSrc = $('#playerframe').attr('src'); // Get the src of the iframe with id 'playerframe'

    return iframeSrc || null; // Return the iframe URL or null if not found
  } catch (error) {
    console.error('Error scraping episode iframe:', error);
    return null; // Return null if there's an error
  }
};



// Scrape all anime list pages (up to 247 pages)
const scrapeAllPages = async () => {
  const totalPages = 100;  // Adjust this if necessary

  for (let page = 1; page <= totalPages; page++) {
    await scrapeAnimeList(page);
  }

  // Return the anime list after scraping all pages
  return animeList;
};

module.exports = { scrapeAnimeList, scrapeAnimeDetails, scrapeAllPages, scrapeEpisodeIframe, animeList };
