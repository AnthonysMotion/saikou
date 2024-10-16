import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllAnimePage from './pages/AllAnimePage';
import AnimePage from './pages/AnimePage';
import useScroll from './components/useScroll';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const scrollingDown = useScroll();

  return (
    <Router>
      <nav className={`navbar ${scrollingDown ? 'shrink' : ''}`}>
        <div className="navbar-left">
          <div className="logo">
            <Link to="/">SAIKOU</Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/anime/list/1">ANIME LIST</Link></li>
            <li><Link to="/popular">POPULAR</Link></li>
          </ul>
        </div>
        <div className="navbar-right">
          <ul className="nav-links">
            <li><Link to="/login">LOG IN</Link></li>
            <li><Link to="/register">REGISTER</Link></li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-anime" element={<AllAnimePage />} />
        <Route path="/anime/list/:page" element={<AllAnimePage />} />
        <Route path="/anime/:animeName" element={<AnimePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Ensure you have this component */}
      </Routes>
    </Router>
  );
}

export default App;
