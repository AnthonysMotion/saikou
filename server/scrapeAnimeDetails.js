const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAnimeDetails = async (animeName) => {
  try {
    const url = `https://ww8.gogoanimes.org/category/${animeName}`;  // Replace with actual URL structure
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Scrape the image source
    const imgSrc = $('.anime_info_body_bg img').attr('src');

    // Scrape the title (h1)
    const title = $('h1').text().trim();

    // Scrape the 6 paragraph tags
    const paragraphs = [];
    $('.anime_info_body p').each((index, element) => {
      if (index < 6) {  // Grab only the first 6 paragraphs
        paragraphs.push($(element).text().trim());
      }
    });

    return {
      title,
      img: imgSrc,
      paragraphs,
    };
  } catch (error) {
    throw new Error('Error scraping anime details');
  }
};

module.exports = scrapeAnimeDetails;
