import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/card'; // Make sure this path is correct

const AllAnimePage = () => {
  const { page } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    fetch(`http://localhost:5000/api/anime-list?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log the response to check the structure
        setAnimeList(data.paginatedAnimeList);
        setTotalItems(data.totalItems);
      })
      .catch((err) => console.log('Error fetching anime:', err));
  }, [page]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="container">
      <h1>Anime List - Page {page}</h1>
      <div className="card-grid">
        {animeList.map((anime) => (
          <Card
            key={anime.url}
            image={anime.image} // Ensure this property exists in your API response
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
