import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import './App.css';

interface User {
  id: number;
  nom: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <header>
        <nav style={{
          // --- Styles de base ---
          padding: '1rem',
          background: '#333',
          color: 'white',
          display: 'flex',
          gap: '20px',

          // --- Styles pour fixer en haut (étape précédente) ---
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          boxSizing: 'border-box',
          zIndex: 1000,

          // --- NOUVEAU : Pour centrer les boutons ---
          justifyContent: 'center', // Centre horizontalement
          alignItems: 'center'      // Centre verticalement (bon pour l'alignement texte/bouton)
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Accueil / Recherche</Link>
          {user ? (
            <span>Bonjour, {user.nom}</span>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Connexion</Link>
          )}
        </nav>
      </header>

      {/* On garde la marge pour ne pas cacher le contenu sous le header */}
      <div className="container" style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;