import React from 'react';
import './Card.css'; // Adjust the path if necessary

const Card = ({ image, name, releaseDate, episodes, plotSummary }) => {
  return (
    <div className="card">
      <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
        <img src={image} alt={name} style={{ display: 'none' }} /> {/* Hidden for accessibility */}
      </div>
      <div className="card-content">
        <h2>{name}</h2>
        <p>Release Date: {releaseDate}</p>
        <p>Episodes: {episodes}</p>
        <p>{plotSummary}</p>
        <button className="play-btn">Watch</button>
      </div>
    </div>
  );
};

export default Card;
