import React from 'react';
import GameCarousel from '../components/GameCarousel.jsx';
import Banner from '../components/Banner.jsx';
import Footer from '../components/Footer.jsx';
import Info from '../components/Info';

function Home() {
  return (
    <div className="home-container">
      <Banner/>
      <Info/>
      <GameCarousel/>
    </div>
  );
}

export default Home;
