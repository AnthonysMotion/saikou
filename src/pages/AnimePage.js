import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom"; // Use the useParams hook to get route params

const AnimePage = () => {
  const [animeDetails, setAnimeDetails] = useState(null);
  const { animeName } = useParams(); // Access animeName from the URL params

  useEffect(() => {
    // Fetch anime details from the server
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/anime/${animeName}`);
        setAnimeDetails(response.data);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };
    fetchAnimeDetails();
  }, [animeName]);

  if (!animeDetails) return <div>Loading...</div>;

  return (
    <div>
      <h1>{animeDetails.name}</h1>
      <img src={animeDetails.image} alt={animeDetails.name} />
      <p>{animeDetails.description}</p> {/* Render description directly as a string */}

      {/* Render episodes if they exist */}
      <p>Total Episodes: {animeDetails.episodes}</p>
    </div>
  );
};

export default AnimePage;
