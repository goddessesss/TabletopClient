import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EventCard from './EventCard.jsx';

const EventList = ({ events, cityNamesByEventId, onEventClick }) => {
  return (
    <Row className="g-4">
      {events.map((event) => (
        <Col key={event.id} xs={12} md={6}>
          <EventCard
            event={event}
            cityName={cityNamesByEventId[event.id]}
            onClick={onEventClick}
          />
        </Col>
      ))}
    </Row>
  );
};

export default EventList;
