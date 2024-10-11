import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom"; // Use the useParams hook to get route params

const AnimePage = () => {
  const [animeDetails, setAnimeDetails] = useState(null);
  const [error, setError] = useState(null);
  const { animeName } = useParams();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/anime/${animeName}`);
        
        if (response.data) {
          setAnimeDetails(response.data);
          setError(null);  // Clear error if data is found
        } else {
          setError('No data found for this anime.');
        }
      } catch (error) {
        setError('Error fetching anime details.');
        console.error('Error fetching anime details:', error);
      }
    };

    if (animeName) {
      fetchAnimeDetails();
    }
  }, [animeName]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div class="container">
      <h1>{animeDetails.name}</h1>
      <img src={animeDetails.image} alt={animeDetails.name} />
      <p><strong>Type:</strong> {animeDetails.type}</p>
      <p><strong>Plot Summary:</strong> {animeDetails.plotSummary}</p>
      <p><strong>Genre:</strong> {animeDetails.genres}</p>
      <p><strong>Released:</strong> {animeDetails.released}</p>
      <p><strong>Status:</strong> {animeDetails.status}</p>
      <p><strong>Total Episodes:</strong> {animeDetails.episodes}</p>
    </div>
  );
};


export default AnimePage;
