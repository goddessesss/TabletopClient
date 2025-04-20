import React, { useEffect, useState } from 'react';
import Dice from "../assets/dice.png";
import Event from "../assets/event.png";
import Find from "../assets/find.png";
import People from "../assets/people.png";
import Game from "../assets/game.png";

function Info() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState([]);

  const handleScroll = () => {
    const element = document.querySelector('.info-img');
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      offers.forEach((_, i) => {
        setTimeout(() => {
          setVisibleBlocks(prev => [...prev, i]);
        }, i * 200);
      });
    }
  }, [isVisible]);

  const offers = [
    {
      text: "Create your own tabletop events",
      image: Game
    },
    {
      text: "Find players nearby",
      image: Find
    },
    {
      text: "Join clubs and communities",
      image: People
    },
    {
      text: "Explore upcoming local game nights",
      image: Event
    }
  ];

  return (
    <div className="info-component">
      <div className={`info-img ${isVisible ? 'visible' : ''}`}>
        <h1 className={`info-title ${isVisible ? 'visible' : ''}`}>
          Play Together — Discover the World of Board Games!
        </h1>
        <p className={`info-description ${isVisible ? 'visible' : ''}`}>
          <strong>Tabletop</strong> is your gateway to the vibrant world of real-life socializing through your favorite tabletop games.<br />
          Create an event, find your crew, or just show up — because in games, it’s not about winning, it’s about the good company!
        </p>
        <img
          src={Dice}
          alt="Tabletop Game Preview"
          className={`dice-image ${isVisible ? 'visible' : ''}`}
        />
      </div>

      <div className="info-block">
        {offers.map((offer, index) => (
          <div className={`block ${visibleBlocks.includes(index) ? 'visible' : ''}`} key={index}>
            <div className="block-img">
              <img src={offer.image} alt={`Offer ${index + 1}`} />
            </div>
            <div className="block-label">
              {offer.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Info;
