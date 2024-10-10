const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAnimeList = async () => {
  const baseURL = 'https://ww8.gogoanimes.org/anime-list';  // Replace with the actual anime list URL
  let pageNum = 1;
  let animeList = [];

  while (true) {
    try {
      const { data } = await axios.get(`${baseURL}?page=${pageNum}`);
      const $ = cheerio.load(data);

      // Scrape the anime list from the current page
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
          url: href,
        });
      });

      // Check if there's a next page, and if not, break the loop
      const nextPage = $('.pagination-next');  // Modify based on the actual website's pagination element
      if (!nextPage.length) {
        break;
      } else {
        pageNum++;  // If there's a next page, move to the next page
      }

    } catch (error) {
      console.error('Error fetching anime list:', error);
      break;
    }
  }

  return animeList;
};

module.exports = scrapeAnimeList;
