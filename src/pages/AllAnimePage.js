import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AllAnimePage() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    // Fetch the anime list from your backend
    axios.get('http://localhost:5000/api/anime')
      .then(response => setAnimeList(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Anime</h1>
      <ul>
        {animeList.map((anime, index) => (
          <li key={index}>
            <Link to={`/anime/${anime.url}`}>{anime.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllAnimePage;
