import React from 'react';

function HomePage() {
  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>SAIKOU</h1>
          <p>The next generation anime platform.<br />Track, discover and watch your favorite anime all in one place.</p>
          <p></p>
          <input className="search-bar" placeholder='Search'></input>
          <button className="search-btn">Search</button>
        </div>
      </div>

      <div className="recommended container">
        <h1>TRENDING</h1>
        <p>Discover trending anime in the community.</p>
      </div>
    </div>
  );
}

export default HomePage;
