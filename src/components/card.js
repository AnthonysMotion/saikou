import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css'; // Adjust the path if necessary

const Card = ({ image, name, released, episodes, plotSummary, url }) => {
  return (
    <div className="card">
      <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
        <img src={image} alt={name} style={{ display: 'none' }} />
      </div>
      <div className="card-content">
        <h2>{name}</h2>
        <p>Release Date: {released}</p> {/* Updated to match the database field */}
        <p>Episodes: {episodes}</p>
        {/*<p>{plotSummary}</p> */}
        <Link to={`/anime/${url}`}>
          <button className="play-btn">Watch</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
