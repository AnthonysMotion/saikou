const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { scrapeAllPages, scrapeAnimeDetails, animeList } = require('./scrape');
const authRouter = require('./auth');
const PORT = 5000;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, '../auth.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the auth database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table created or already exists.');
                }
            });
        });
    }
});

app.use('/', authRouter);

app.get('/api/anime-list', (req, res) => {
    const { page = 1 } = req.query;
    const itemsPerPage = 100;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedAnimeList = animeList.slice(startIndex, startIndex + itemsPerPage);

    res.json({
        totalItems: animeList.length,
        paginatedAnimeList,
    });
});

app.get('/api/anime/:animeName', async (req, res) => {
    const { animeName } = req.params;
    const anime = animeList.find((item) => item.url === animeName);

    if (anime) {
        const details = await scrapeAnimeDetails(anime.url);
        if (details) {
            const animeDetails = { ...anime, ...details };
            res.json(animeDetails);
        } else {
            res.status(404).json({ message: 'Anime details not found' });
        }
    } else {
        res.status(404).json({ message: 'Anime not found' });
    }
});

app.get('/api/anime/episode/:animeName/:episodeNumber', async (req, res) => {
    const { animeName, episodeNumber } = req.params;
    const url = `https://ww1.9anime2.com/watch/${animeName}/${episodeNumber}`;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let iframeSrc = $('#playerframe').attr('src');
        if (iframeSrc && iframeSrc.startsWith('/embed/')) {
            iframeSrc = `https://ww1.9anime2.com${iframeSrc}`;
        }

        if (iframeSrc) {
            res.json({ iframe: iframeSrc });
        } else {
            res.status(404).json({ error: 'Iframe not found' });
        }
    } catch (error) {
        console.error('Error scraping the page:', error);
        res.status(500).json({ error: 'Failed to fetch episode details' });
    }
});

scrapeAllPages().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error scraping pages:', error);
});
