import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaWifi } from 'react-icons/fa';
import { EventTypeEnum } from '../../enums/eventTypes.js';
import { useAuth } from '../Context/AuthContext.jsx';

const EventCard = ({ event, onClick }) => {
  const { userId } = useAuth()

  const formatPlayers = (registeredPlayers, maxPlayers) => {
    if (maxPlayers == null) {
      return `${registeredPlayers} players`;
    }
    return `${registeredPlayers}/${maxPlayers} players`;
  }
  
  return (
    <Card
      className="card-event shadow-sm h-100 border-0"
      onClick={() => onClick(event.id)}
      style={{ cursor: 'pointer', borderRadius: '1rem' }}
    >
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="mb-2 fs-5 text-truncate">{event.name}</Card.Title>
          <div className="text-muted small d-flex align-items-center">
            <FaCalendarAlt className="me-2" />
            {`${new Date(event.startDate).toLocaleString()} - ${new Date(event.startDate).toLocaleString()}`}
          </div>
          <div className="text-muted small d-flex align-items-center mt-1">
            <FaMapMarkerAlt className="me-2" />
            {event.location?.shortName ?? event.location?.fullName ?? "No location"}
          </div>
          <div className="text-muted small d-flex align-items-center mt-1">
            <FaMoneyBillWave className="me-2" />
            {event.price === null || event.price === 0 ? 'Free' : `${event.price} ₴`}
          </div>
        </div>

        <div className="mb-3 d-flex flex-wrap gap-2">
          <Badge bg={event.isOnline ? 'success' : 'secondary'}>
            {event.isOnline ? (
              <>
                <FaWifi className="me-1" />
                Online
              </>
            ) : (
              'Offline'
            )}
          </Badge>
          <Badge bg="info">
            {EventTypeEnum[event.eventType] ?? event.eventType}
          </Badge>
          <Badge bg="warning" text="dark">
            {formatPlayers(event.registeredPlayer, event.maxPlayers)}
          </Badge>
        </div>

        <Button
          variant="outline-primary"
          className="mt-auto align-self-end"
          onClick={(e) => {
            e.stopPropagation();
            onClick(event.id);
          }}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
