import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllAnimePage from './pages/AllAnimePage';
import AnimePage from './pages/AnimePage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/all-anime">All Anime</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-anime" element={<AllAnimePage />} />
        <Route path="/anime/:animeName" element={<AnimePage />} />
      </Routes>
    </Router>
  );
}

export default App;
