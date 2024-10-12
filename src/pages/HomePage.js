import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '../components/card'; // Ensure this path is correct
import axios from 'axios';

function HomePage() {
  const [animeData, setAnimeData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch anime data when the component mounts
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const animeUrls = ['naruto', 'one-piece', 'bocchi-the-rock', 'k-on', 'dragon-ball-z', 'hunter-x-hunter-2011'];

        const promises = animeUrls.map((url) => axios.get(`http://localhost:5000/api/anime/${url}`));

        const results = await Promise.all(promises);

        setAnimeData(results.map((res) => res.data));
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimeData();

    const handleScroll = () => {
      const header = document.querySelector('.header');
      let scrollPosition = window.scrollY;
      header.style.backgroundPositionY = `${scrollPosition * 0.2}px`;
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle the search action
  const searchAnime = () => {
    const title = document.getElementById("id-search-bar").value;
    const updatedTitle = title.replaceAll(' ', '-');

    // Redirect to the anime page
    navigate(`/anime/${updatedTitle}`);
  };

  return (
    <div>
      <div className="header" id="header">
        <div className="container">
          <h1>SAIKOU</h1>
          <p>The next generation anime platform.<br />Track, discover, and watch your favorite anime all in one place.</p>
          <div className="input-ctn">
            <input className="search-bar" id='id-search-bar' placeholder='Search' />
            <button className="search-btn" id='id-search-btn' onClick={searchAnime}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        <img src='https://i.redd.it/5f4smdm2rfd81.gif' alt="Animated Background" />
      </div>

      <div className="recommended container">
        <h1>TRENDING</h1>
        <p>Discover trending anime in the community</p>
        <div className="card-grid">
          {animeData.map((anime, index) => (
            <Card
              key={anime.url}
              image={anime.image}
              name={anime.name}
              releaseDate={anime.released}
              episodes={anime.episodes}
              plotSummary={anime.plotSummary}
              url={anime.url}
              status={anime.status}
            />
          ))}
        </div>
      </div>
      {/*
            <div className="popular container">
        <h1>POPULAR</h1>
        <p>Discover the most popular anime in the community</p>
      </div>
      */}
    </div>
  );
}

export default HomePage;
