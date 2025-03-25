import React, { useState } from 'react';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { FaRegHandshake, FaFilter } from 'react-icons/fa';
import SearchBar from '../components/Search/SearchBar.jsx'; 
import '../styles/Events.css';

function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([
    { id: 1, name: "Catan", date: "2025-03-25", time: "18:00", genre: "Strategy", players: 4, joined: 2 },
    { id: 2, name: "Monopoly", date: "2025-03-26", time: "19:00", genre: "Family", players: 6, joined: 0 },
    { id: 3, name: "Pandemic", date: "2025-03-27", time: "17:00", genre: "Cooperative", players: 4, joined: 0 },
  ]);

  const handleJoin = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId && event.joined < event.players
        ? { ...event, joined: event.joined + 1 }
        : event
    ));
    alert(`You joined the event: ${eventId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="events-container"> 
      <h1 className="events-title">Events</h1>

      <Row className="mb-5 align-items-center w-100">
        <Col xs={10} className="pe-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
        </Col>

        <Col xs={2} className="ps-0 text-end"> 
          <Button 
            variant="warning" 
            size="xl" 
            className="w-100 filter-button"
          >
            <FaFilter className="me-2" /> 
            <span className="text">Filter</span>
          </Button>
        </Col>
      </Row>

      <Row className="event-header w-100">
        <Col className="event-header-col">Date</Col>
        <Col className="event-header-col">Name</Col>
        <Col className="event-header-col">Genre</Col>
        <Col className="event-header-col">Players</Col>
        <Col className="event-header-col">Join</Col>
      </Row>

      {filteredEvents.map(event => (
        <Card key={event.id} className="event-card mb-4 shadow-lg w-100">
          <Card.Body>
            <Row className="event-row">
              <Col className="event-col date-col">
                {event.date} at {event.time}
              </Col>
              <Col className="event-col name-col">{event.name}</Col>
              <Col className="event-col genre-col">{event.genre}</Col>
              <Col className="event-col">
                {event.joined} / {event.players}
              </Col>
              <Col className="event-col">  
                <Button 
                  variant="warning" 
                  className="join-button btn-lg" 
                  onClick={() => handleJoin(event.id)}
                  disabled={event.joined >= event.players}
                  size="xl"
                >
                  <FaRegHandshake /> 
                  <span className="text">Join</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default Events;
