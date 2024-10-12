import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

const AnimePage = () => {
  const [animeDetails, setAnimeDetails] = useState(null);
  const [error, setError] = useState(null);
  const { animeName } = useParams();
  const [episodeIframe, setEpisodeIframe] = useState(''); // Initialize without a URL
  const [currentEpisode, setCurrentEpisode] = useState(1); // Track current episode

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/anime/${animeName}`);
        
        if (response.data) {
          setAnimeDetails(response.data);
          setError(null);
          // Automatically fetch Episode 1 after anime details are loaded
          handleEpisodeClick(1);
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

  const handleEpisodeClick = async (episodeNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/anime/episode/${animeName}/${episodeNumber}`);
      console.log(response.data);
      if (response.data && response.data.iframe) {
        setEpisodeIframe(response.data.iframe);
        setCurrentEpisode(episodeNumber);
      } else {
        setError('Error fetching episode details.');
      }
    } catch (error) {
      setError('Error fetching episode details.');
      console.error('Error fetching episode details:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="anime-details container">
      <h1>{animeDetails.name} - Episode {currentEpisode}</h1>

      {/* Iframe section for episode */}
      <div className="iframe-container">
        <iframe
          src={episodeIframe}
          title={`Episode ${currentEpisode}`}
          allowFullScreen
          frameBorder="0"
          marginWidth="0"
          marginHeight="0"
          scrolling="no"
          width="100%"
          height="1080"
        ></iframe>
      </div>

      {/* Episode buttons */}
      <div className="episode-buttons">
      <button>Previous Episode</button>
        {Array.from({ length: animeDetails.episodes }, (_, index) => (
          <button key={index + 1} onClick={() => handleEpisodeClick(index + 1)}>
            Episode {index + 1}
          </button>
        ))}
        <button>Next Episode</button>
      </div>

      <div className="anime-content">
        <img src={animeDetails.image} alt={animeDetails.name} className="anime-image" />
        <div className="anime-info">
          <p><strong>Type:</strong> {animeDetails.type}</p>
          <p><strong>Plot Summary:</strong> {animeDetails.plotSummary}</p>
          <p><strong>Genre:</strong> {animeDetails.genres.join(', ')}</p>
          <p><strong>Released:</strong> {animeDetails.released}</p>
          <p><strong>Status:</strong> {animeDetails.status}</p>
          <p><strong>Total Episodes:</strong> {animeDetails.episodes}</p>
        </div>
      </div>


    </div>
  );
};

export default AnimePage;
