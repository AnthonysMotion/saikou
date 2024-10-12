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
        // Fetch anime details from the backend API
        const response = await axios.get(`http://localhost:5000/api/anime/${animeName}`);
        
        // Check if data is received and set the state accordingly
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

    // Fetch details if animeName is available
    if (animeName) {
      fetchAnimeDetails();
    }
  }, [animeName]);

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Handle loading state
  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  // Render anime details
  return (
    <div className="anime-details container">
      <h1>{animeDetails.name}</h1>
      <div className="anime-content">
        <img src={animeDetails.image} alt={animeDetails.name} className="anime-image" />
        <div className="anime-info">
          <p><strong>Type:</strong> {animeDetails.type}</p>
          <p><strong>Plot Summary:</strong> {animeDetails.plotSummary}</p>
          <p><strong>Genre:</strong> {animeDetails.genres.join(', ')}</p> {/* Join genres for better display */}
          <p><strong>Released:</strong> {animeDetails.released}</p>
          <p><strong>Status:</strong> {animeDetails.status}</p>
          <p><strong>Total Episodes:</strong> {animeDetails.episodes}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
