import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/card'; // Adjust the import path as necessary
import axios from 'axios';

const AllAnimePage = () => {
  const { page } = useParams(); 
  const [animeList, setAnimeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0); 
  const itemsPerPage = 100;  

  // Fetch anime list based on current page
  useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/anime-list?page=${page}`);
        const data = await response.json();
        setTotalItems(data.totalItems); 

        // Fetch detailed anime data
        const animePromises = data.paginatedAnimeList.map((anime) =>
          axios.get(`http://localhost:5000/api/anime/${anime.url}`)
        );
        const animeResponses = await Promise.all(animePromises);
        setAnimeList(animeResponses.map(res => res.data)); // Set the detailed anime data
      } catch (err) {
        console.log('Error fetching anime:', err);
      }
    };

    fetchAnimeList();
  }, [page]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container">
      <h1>Anime List - Page {page}</h1>
      <div className="card-grid">
        {animeList.map((anime) => (
          <Card
            key={anime.url}
            image={anime.image} // Assuming your anime object has an image property
            name={anime.name}
            releaseDate={anime.released}
            episodes={anime.episodes}
            plotSummary={anime.plotSummary}
          />
        ))}
      </div>

      {/* Pagination Buttons */}
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
