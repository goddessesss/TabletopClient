import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dice from "../assets/dice.png";
import Event from "../assets/event.png";
import Find from "../assets/find.png";
import People from "../assets/people.png";
import Game from "../assets/game.png";

function Info() {
  const { t } = useTranslation();
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
      t('info.offers', { returnObjects: true }).forEach((_, i) => {
        setTimeout(() => {
          setVisibleBlocks(prev => [...prev, i]);
        }, i * 200);
      });
    }
  }, [isVisible, t]);

  const offersImages = [Game, Find, People, Event];
  const offersTexts = t('info.offers', { returnObjects: true });

  return (
    <div className="info-component">
      <div className={`info-img ${isVisible ? 'visible' : ''}`}>
        <h1 className={`info-title ${isVisible ? 'visible' : ''}`}>
          {t('info.title')}
        </h1>
        <p
          className={`info-description ${isVisible ? 'visible' : ''}`}
          dangerouslySetInnerHTML={{ __html: t('info.description') }}
        />
        <img
          src={Dice}
          alt={t('info.diceAlt')}
          className={`dice-image ${isVisible ? 'visible' : ''}`}
        />
      </div>

      <div className="info-block">
        {offersTexts.map((text, index) => (
          <div className={`block ${visibleBlocks.includes(index) ? 'visible' : ''}`} key={index}>
            <div className="block-img">
              <img src={offersImages[index]} alt={`Offer ${index + 1}`} />
            </div>
            <div className="block-label">
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Info;
