import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AllAnimePage = () => {
  const { page } = useParams(); // Get the page from URL params
  const [animeList, setAnimeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);  // New state to store the total item count
  const itemsPerPage = 100;  // Set the items per page (same as backend)

  // Fetch anime list based on current page
  useEffect(() => {
    fetch(`http://localhost:5000/api/anime-list?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data.paginatedAnimeList);  // Set the anime list
        setTotalItems(data.totalItems);  // Set total number of items
      })
      .catch((err) => console.log('Error fetching anime:', err));
  }, [page]);

  // Calculate total pages based on total items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div class="container">
      <h1>Anime List - Page {page}</h1>
      <div>
        {animeList.map((anime) => (
          <div key={anime.url}>
            <h2>{anime.name}</h2>
            <a href={`/anime/${anime.url}`}>Watch {anime.name}</a>
          </div>
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
