import React, { useEffect, useState } from 'react';
import Card from '../components/card'; // Make sure this path is correct
import axios from 'axios';

function HomePage() {
  const [animeData, setAnimeData] = useState([]);

  // Fetch anime data when the component mounts
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const animeUrls = ['naruto', 'one-piece', 'bocchi-the-rock', 'k-on', 'dragon-ball-z', 'wangan-midnight'];
    
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

  return (
    <div>
      <div className="header" id="header">
        <div className="container">
          <h1>SAIKOU</h1>
          <p>The next generation anime platform.<br />Track, discover and watch your favorite anime all in one place.</p>
          <div className="input-ctn">
            <input className="search-bar" placeholder='Search'></input>
            <button className="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
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
              key={index}
              image={anime.image}
              name={anime.name}
              releaseDate={anime.released}
              episodes={anime.episodes}
              plotSummary={anime.plotSummary}
            />
          ))}
        </div>
      </div>
      <div className="popular container">
        <h1>POPULAR</h1>
        <p>Discover the most popular anime in the community</p>
      </div>
    </div>
  );
}

export default HomePage;
