import React, { useState, useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import ImageSlider1 from '../assets/ImageSlider1.png';
import ImageSlider2 from '../assets/ImageSlider2.png';
import ImageSlider3 from '../assets/ImageSlider3.png';
import ImageSlider4 from '../assets/ImageSlider4.png';
import ImageSlider5 from '../assets/ImageSlider4.png';
import ImageSlider6 from '../assets/ImageSlider4.png';

function GameCarousel() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 5,
      slidesToSlide: 5,
    },
    largeTablet: {
      breakpoint: { max: 1099, min: 992 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 991, min: 768 },
      items: 3,
      slidesToSlide: 3,
    },
    smallTablet: {
      breakpoint: { max: 767, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 540, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const handleScroll = () => {
    const element = document.querySelector('.carousel-title');
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

  return (
    <section className="carousel" id="game-carousel">
      <Container fluid>
        <Row className="justify-content-center text-center">
          <Col xs={12}>
            <div className="game-box">
              <h2 className={`carousel-title ${isVisible ? 'visible' : ''}`}>
                {t('carousel.title')}
              </h2>
              <p className={`carousel-description ${isVisible ? 'visible' : ''}`}>
                {t('carousel.description')}
              </p>
              <Carousel
                responsive={responsive}
                infinite={true}
                className="game-slider"
              >
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider1} alt={t('carousel.alts.adventure')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.adventure')}</h5>
                </div>
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider2} alt={t('carousel.alts.dice')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.dice')}</h5>
                </div>
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider3} alt={t('carousel.alts.strategy')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.strategy')}</h5>
                </div>
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider4} alt={t('carousel.alts.family')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.family')}</h5>
                </div>
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider5} alt={t('carousel.alts.adventure')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.adventure')}</h5>
                </div>
                <div className={`item ${isVisible ? 'visible' : ''}`}>
                  <img src={ImageSlider6} alt={t('carousel.alts.party')} className={`carousel-image ${isVisible ? 'visible' : ''}`} />
                  <h5>{t('carousel.items.party')}</h5>
                </div>
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default GameCarousel;
