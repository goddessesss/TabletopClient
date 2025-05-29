import React from "react";
import { Button, Card, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatedEventsTab({ loading, events }) {
  const navigate = useNavigate();

  if (loading) return <p className="text-center">Loading events...</p>;

  if (!events || events.length === 0) {
    return <p className="text-center">You haven't created any events yet.</p>;
  }

  return (
    <div className="container py-4">
      <ListGroup variant="flush">
        {events.map((event) => (
          <ListGroup.Item key={event.id} className="mb-4 p-0 border-0">
            <Card className="event-card">
              {event.image && (
                <Card.Img
                  variant="top"
                  src={event.image}
                  alt={event.name}
                  className="event-image"
                />
              )}
              <Card.Body>
                <Card.Title className="event-title">{event.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <Badge bg="info" className="me-2">
                    {new Date(event.startDate).toLocaleString()}
                  </Badge>
                  <Badge bg="secondary">
                    {new Date(event.endDate).toLocaleString()}
                  </Badge>
                </Card.Subtitle>
                <Card.Text className="event-description">
                  <strong>Description:</strong> {event.description || "No description"}
                </Card.Text>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/event/edit/${event.id}`)}
                  >
                    Edit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CreatedEventsTab;
