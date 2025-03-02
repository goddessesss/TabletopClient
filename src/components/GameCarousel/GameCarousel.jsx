import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import { Container, Row, Col } from 'react-bootstrap';
import './GameCarousel.css';
import ImageSlider1 from '../../assets/ImageSlider1.png';
import ImageSlider2 from '../../assets/ImageSlider2.png';
import ImageSlider3 from '../../assets/ImageSlider3.png';
import ImageSlider4 from '../../assets/ImageSlider4.png';

function GameCarousel() {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <section className="carousel" id="game-carousel">
            <Container>
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={10} lg={8}>
                        <div className="game-box">
                            <h2 className="carousel-title">Explore Our Games</h2>
                            <p className="carousel-description">
                                Discover a variety of exciting games that will keep you entertained for hours!
                            </p>
                            <Carousel responsive={responsive} infinite={true} className="game-slider">
                                <div className="item">
                                    <img src={ImageSlider1} alt="Solitaire" className="carousel-image" />
                                    <h5>Solitaire</h5>
                                </div>
                                <div className="item">
                                    <img src={ImageSlider2} alt="Casual" className="carousel-image" />
                                    <h5>Casual</h5>
                                </div>
                                <div className="item">
                                    <img src={ImageSlider3} alt="Strategy" className="carousel-image" />
                                    <h5>Strategy</h5>
                                </div>
                                <div className="item">
                                    <img src={ImageSlider4} alt="Family" className="carousel-image" />
                                    <h5>Family</h5>
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
