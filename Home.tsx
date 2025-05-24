// Home.tsx
import React from 'react';

interface HomeProps {
  onGetStarted: () => void;
  // onShowHelp prop is removed as a global help button handles it
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="homepage">
      <div className="overlay">
        {/* If you have a logo image, you can include it here */}
        {/* <img src="/path/to/your/logo.png" alt="Jsonique Logo" className="logo-image" /> */}

        <h1 className="subtitle">Jsonique</h1>
        <p className="tagline">Tables That Tell The Truth. Instantly. Effortlessly.</p>

        <div className="home-buttons-wrapper">
          <button className="cta-button" onClick={onGetStarted}>
            Get Started
          </button>
          {/* The Home page specific help button is removed as it's now global */}
        </div>
      </div>
    </div>
  );
};

export default Home;
