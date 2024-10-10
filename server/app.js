const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 5000;

app.get('/api/anime', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    try {
      const { data } = await axios.get('https://externalwebsite.com/anime');
      const $ = cheerio.load(data);
      const anime = [];
  
      $('ul.anime-list li').each((i, element) => {
        const title = $(element).find('a').text();
        const id = $(element).find('a').attr('href').split('/').pop();
        anime.push({ id, title });
      });
  
      const paginatedanime = anime.slice((page - 1) * limit, page * limit);
      res.json(paginatedanime);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error scraping the anime list' });
    }
  });  

app.get('/api/anime/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data } = await axios.get(`https://ww8.gogoanimes.org/category/${id}`);
    const $ = cheerio.load(data);
    
    const title = $('h1.anime-title').text();
    const description = $('p.anime-description').text();
    const episodes = [];

    $('ul.episode-list li').each((i, element) => {
      const episodeTitle = $(element).find('a').text();
      const videoUrl = $(element).find('a').attr('href');
      episodes.push({ title: episodeTitle, videoUrl });
    });

    res.json({ title, description, episodes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error scraping the anime details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
