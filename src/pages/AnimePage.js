import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnimePage = () => {
  const { animeName } = useParams();  // Get the anime name from the URL
  const [animeDetails, setAnimeDetails] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        // Call the API endpoint that scrapes the anime details from the individual anime page
        const response = await axios.get(`http://localhost:5000/api/anime/${animeName}`);
        setAnimeDetails(response.data);  // Set the scraped anime details
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [animeName]);

  return (
    <div>
      {animeDetails ? (
        <>
          <h1>{animeDetails.title}</h1>
          <img src={animeDetails.img} alt={animeDetails.title} />
          <div>
            {animeDetails.paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>
        </>
      ) : (
        <p>Loading anime details...</p>
      )}
    </div>
  );
}

export default AnimePage;
