import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AllAnimePage = () => {
  const { page } = useParams(); // Use useParams to get the page from the URL
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/anime-list?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data); // Set the anime list from the API
      })
      .catch((err) => console.log('Error fetching anime:', err));
  }, [page]);

  return (
    <div>
      <h1>Anime List - Page {page}</h1>
      <div>
        {animeList.map((anime) => (
          <div key={anime.url}>
            <p>{anime.name}</p>
            <a href={`/anime/${anime.url}`}>Watch {anime.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAnimePage;
