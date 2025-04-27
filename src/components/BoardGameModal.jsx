import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { getBoardGameById } from '../api/eventsApi.js';

const BoardGameModal = ({ show, onHide, eventId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardGameDetails = async () => {
      setLoading(true);
      const result = await getBoardGameById(eventId);
      console.log(result); 

      if (result.success) {
        setData(result.data);
      } else {
        console.error("Failed to fetch board game details:", result.message);
      }
      setLoading(false);
    };

    if (eventId) {
      fetchBoardGameDetails();
    }
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.boardGame) {
    return <div>Game information not found.</div>;
  }

  const { boardGame, categories = [], mechanics = [], publishers = [], designers = [], themes = [] } = data;

  const categoryBadges = categories.length > 0
    ? categories.map((category, idx) => (
        <Badge key={idx} bg="primary" className="me-1">{category.category?.name}</Badge>
      ))
    : <span>No categories specified</span>;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{boardGame.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={boardGame.imagePath}
          alt={boardGame.name}
          className="img-fluid mb-3 rounded"
          style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
        />
        <div style={{ marginBottom: '20px' }}>
          <strong>Description: </strong>
          <p style={{ textAlign: 'justify' }}>{boardGame.description || 'No description available.'}</p>
        </div>

        <div className="mb-2">
          <strong>Categories: </strong>
          {categoryBadges}
        </div>

        <div className="mb-2">
          <strong>Mechanics: </strong>
          {mechanics.length > 0 ? (
            mechanics.map((mechanic, idx) => (
              <Badge key={idx} bg="secondary" className="me-1">{mechanic.name}</Badge>
            ))
          ) : (
            <span>No mechanics specified</span>
          )}
        </div>

        <div className="mb-2">
          <strong>Publishers: </strong>
          {publishers.length > 0 ? (
            publishers.map((publisher, idx) => (
              <Badge key={idx} bg="info" className="me-1">{publisher.name}</Badge>
            ))
          ) : (
            <span>No publishers specified</span>
          )}
        </div>

        <div className="mb-2">
          <strong>Designers: </strong>
          {designers.length > 0 ? (
            designers.map((designer, idx) => (
              <Badge key={idx} bg="dark" className="me-1">{designer.name}</Badge>
            ))
          ) : (
            <span>No designers specified</span>
          )}
        </div>

        <div className="mb-2">
          <strong>Themes: </strong>
          {themes.length > 0 ? (
            themes.map((theme, idx) => (
              <Badge key={idx} bg="warning" className="me-1">{theme.name}</Badge>
            ))
          ) : (
            <span>No themes specified</span>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BoardGameModal;
