import { Modal, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EventShortDetailsModal = ({ event, onClose }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const getStatusVariant = (statusName) => {
    switch (statusName) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Canceled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal
      show={!!event}
      onHide={onClose}
      centered
      size="md"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title className="w-100 text-center">
          <span className="fw-bold m-1">{event.name}</span>
          {event.isOrganizedByUser ? (
            <Badge bg="info">Organizer</Badge>
          ) : (
            <Badge bg="secondary">Participant</Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="mb-3">
          <strong>Start:</strong>{' '}
          {new Date(event.startDate).toLocaleString()}
        </div>
        <div className="mb-3">
          <strong>End:</strong>{' '}
          {new Date(event.endDate).toLocaleString()}
        </div>
        <div className="mb-3">
          <strong>Status:</strong>{' '}
          <Badge bg={getStatusVariant(event.statusName)}>
            {event.statusName}
          </Badge>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View Event Page
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventShortDetailsModal;