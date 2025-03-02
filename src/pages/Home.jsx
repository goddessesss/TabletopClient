import React from 'react';
import GameCarousel from '../components/GameCarousel/GameCarousel';
import Banner from '../components/Banner/Banner';
import Footer from '../components/Footer/Footer';

function Home() {
  return (
    <div className="home-container">
      <Banner />
      <GameCarousel />
      <Footer />
    </div>
  );
}

export default Home;
