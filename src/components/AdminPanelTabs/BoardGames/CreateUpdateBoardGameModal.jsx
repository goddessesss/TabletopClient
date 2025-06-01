import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Table,
  ListGroup,
  Spinner
} from 'react-bootstrap';
import { useNotifications } from '../../NotificationsHandling/NotificationContext';
import { createOrUpdateBoardGame, getBoardGameFromBggSearch, getBoardGameUpdateDetails } from '../../../api/boardgameApi';
import { BOARDGAME_FIELDS } from './fieldsConfig';

const CreateUpdateBoardGameModal = ({ show, onHide }) => {
  const { addNotification } = useNotifications()

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 4) {
      setSuggestions([]);
      return;
    }

    if (selectedGame && searchTerm === selectedGame.name) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      const result = await getBoardGameFromBggSearch(searchTerm);
      if (result.success) {
        setSuggestions(result.data);
      } else {
        setSuggestions([]);
        addNotification({message:"An error occured while retrieving board games", variant: 'danger'});
      }
      setLoadingSuggestions(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (game) => {
    setSelectedGame(game);
    setSearchTerm(game.name);
    setSuggestions([]);
    setDetails(null);
  };

  const loadDetails = async () => {
    if (!selectedGame) return;
    setLoadingDetails(true);
    const result = await getBoardGameUpdateDetails(selectedGame.bggId);
    if (result.success) {
      setDetails(result.data); // предполагаем { existing, updated }
    } else {
      addNotification({message:"An error occured while retrieving board game details", variant: 'danger'});
    }
    setLoadingDetails(false);
  };

  const handleConfirm = async () => {
    if (!selectedGame) return;
    setUpdating(true);
    const result = await createOrUpdateBoardGame(selectedGame.bggId);
    if (result) {
      onHide();
      addNotification({message:"Board game successfully added / updated", variant: 'success'});
    } else {
      addNotification({message:"An error occured while modifying board games", variant: 'danger'});
    }
    setUpdating(false);
  };

  const renderTable = () => {
    if (!details) return null;

    const { existingGame, updatedGame } = details;

    return (
      <Table bordered size="sm" className="mt-3 fixed-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Property</th>
            <th style={{ width: '40%' }}>Existing</th>
            <th style={{ width: '40%' }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {BOARDGAME_FIELDS.map(field => {
            const existingRaw = field.source
            ? existingGame?.[field.source]
            : existingGame?.boardGame?.[field.key];

          const updatedRaw = field.source
            ? updatedGame?.[field.source]
            : updatedGame?.boardGame?.[field.key];

          const existingValue = field.format
            ? field.format(existingRaw)
            : String(existingRaw ?? '');

          const updatedValue = field.format
            ? field.format(updatedRaw)
            : String(updatedRaw ?? '');

          return (
            <tr key={field.key || field.source}>
              <td>{field.label}</td>
              <td>{existingValue}</td>
              <td>{updatedValue}</td>
            </tr>
          );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add / Update Board Game</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group controlId="game-search">
          <Form.Label>Search Board Game</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedGame(null);
              setDetails(null);
            }}
            placeholder="Enter at least 3 characters…"
          />
        </Form.Group>

        {loadingSuggestions && <Spinner animation="border" size="sm" />}

        {!loadingSuggestions && suggestions.length > 0 && (
          <ListGroup className="position-relative" style={{ zIndex: 10 }}>
            {suggestions.map((g) => (
              <ListGroup.Item
                key={g.bggId}
                action
                onClick={() => handleSelect(g)}
              >
                {`${g.name} (${g.yearPublished})`}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <div className="mt-3">
          <Button
            onClick={loadDetails}
            disabled={!selectedGame || loadingDetails}
          >
            {loadingDetails ? 'Loading…' : 'Load Details'}
          </Button>
        </div>
        {renderTable()}
        <div style={{ overflowX: 'auto' }}>
          
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={updating}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!details || updating}
        >
          {updating ? 'Saving…' : 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUpdateBoardGameModal;