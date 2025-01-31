import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';
import AnimeDetails from './components/AnimeDetails';
import AnimesPage from './components/AnimesPage';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/animes">All Animes</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/animes" element={<AnimesPage />} />
        </Routes>
      </Router>
    </>
  );
};
export default App;
