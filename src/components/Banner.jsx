import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsArrowRightCircle } from 'react-icons/bs';

function Banner() {
    const [loopNum, setLoopNum] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const toRotate = ["PLAYERS!", "FUN!", "FRIENDS!"];
    const period = 2000;

    useEffect(() => {
        const ticker = setInterval(() => {
            tick();
        }, delta);

        return () => clearInterval(ticker);
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(300 - Math.random() * 100);
        }
    };

    return (
        <div className='banner'>
            <div className="image-container">
            </div>
            <Container className="text-center text-container">
                <Row className="align-items-center">
                    <Col xs={12}>
                        <span className="tagline">Welcome to</span>
                        <span className="navbar-title" style={{ marginLeft: "10px" }}>TABLETOP!</span>
                        <h1 className="main-heading">FIND THE PERFECT BOARD GAME AND <span className="wrap">{text}</span></h1>
                        <p className="description">Gather the best players and create an unforgettable game!</p>
                        <button className="start-button" onClick={() => console.log("connect")}>
                            GET STARTED <BsArrowRightCircle size={25} />
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Banner;
