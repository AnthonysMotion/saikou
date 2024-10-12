import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/card';
import axios from 'axios';

const AllAnimePage = () => {
  const { page } = useParams(); 
  const [animeList, setAnimeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);  // Loading state
  const itemsPerPage = 100;  

  useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        setLoading(true);  // Set loading to true
        const response = await fetch(`http://localhost:5000/api/anime-list?page=${page}`);
        const data = await response.json();

        const animePromises = data.paginatedAnimeList.map((anime) =>
          axios.get(`http://localhost:5000/api/anime/${anime.url}`)
        );
        const animeResponses = await Promise.all(animePromises);
        setAnimeList(animeResponses.map(res => res.data));
        setTotalItems(data.totalItems);
      } catch (err) {
        console.log('Error fetching anime:', err);
      } finally {
        setLoading(false);  // Set loading to false
      }
    };

    fetchAnimeList();
  }, [page]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container">
      <h1>Anime List - Page {page}</h1>
      <div>
        {Number(page) > 1 && (
          <Link to={`/anime/list/${Number(page) - 1}`}>Previous</Link>
        )}
        {Number(page) < totalPages && (
          <Link to={`/anime/list/${Number(page) + 1}`}>Next</Link>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card-grid">
          {animeList.map((anime) => (
            <Card
              key={anime.url}
              image={anime.image}
              name={anime.name}
              releaseDate={anime.released}
              episodes={anime.episodes}
              plotSummary={anime.plotSummary}
            />
          ))}
        </div>
      )}

      <div>
        {Number(page) > 1 && (
          <Link to={`/anime/list/${Number(page) - 1}`}>Previous</Link>
        )}
        {Number(page) < totalPages && (
          <Link to={`/anime/list/${Number(page) + 1}`}>Next</Link>
        )}
      </div>
    </div>
  );
};

export default AllAnimePage;
