// src/pages/AnimePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import Pagination from "../components/Pagination"; // Import the Pagination component

const AnimePage = () => {
  const { page } = useParams();  // Grab the page number from the URL
  const [animeList, setAnimeList] = useState([]);

  // Fetch anime data for the current page when the page number changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/anime/${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data);  // Set the anime data for the current page
      })
      .catch((err) => console.log("Error fetching anime:", err));
  }, [page]);  // This will re-fetch the data when the page changes

  return (
    <div>
      <h1>Anime List - Page {page}</h1>
      <div className="anime-list">
        {animeList.map((anime) => (
          <div key={anime.url}>
            <h2>{anime.name}</h2>
            <a href={`/anime/${anime.url}`}>Watch {anime.name}</a>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <Pagination currentPage={Number(page)} totalItems={animeList.length} itemsPerPage={40} />
    </div>
  );
};

export default AnimePage;
