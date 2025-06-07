import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const GameClubGrid = ({ clubs }) => {
  return (
    <Container className="py-4">
      <div>
        <Row className="g-4 w-auto justify-content-center">
          {clubs.map((club) => (
            <Col key={club.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                className="shadow-sm rounded-4"
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Card.Img
                  variant="top"
                  src={club.pictureUrl}
                  alt={club.name}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ fontSize: '1.2rem', fontWeight: '600' }}>{club.name}</Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>
                    {club.description.slice(0, 200)}...
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  className="bg-white border-top-0 d-flex flex-column gap-1 px-3 pb-3"
                  style={{
                    borderBottomLeftRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: '#333' }}>
                    <FaMapMarkerAlt style={{ marginRight: 6 }} />
                    {club.location?.fullName || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#333' }}>
                    <FaPhoneAlt style={{ marginRight: 6 }} />
                    {club.phoneNumber}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default GameClubGrid;