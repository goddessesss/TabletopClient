import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getBoardGamesNames, getCitiesBySearch } from "../../api/eventsApi.js";
import AsyncSelect from "react-select/async";

const eventTypes = [
  { id: 0, name: "GameSession" },
  { id: 1, name: "Tournament" },
  { id: 2, name: "Meetup" },
  { id: 3, name: "Convention" },
  { id: 4, name: "Other" },
];

function UpdateEventModal({ show, event, onSave, onClose, saving }) {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [gameClubName, setGameClubName] = useState("");
  const [id, setId] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [boardGameId, setBoardGameId] = useState("");
  const [boardGameName, setBoardGameName] = useState("");
  const [boardGames, setBoardGames] = useState([]);

  useEffect(() => {
    async function loadBoardGames() {
      try {
        const response = await getBoardGamesNames();
        if (response.success) {
          setBoardGames(response.data);
        } else {
          setBoardGames([]);
        }
      } catch {
        setBoardGames([]);
      }
    }
    loadBoardGames();
  }, []);

  useEffect(() => {
    if (event) {
      setDescription(event.description ?? "");
      setStartDate(event.startDate ?? "");
      setEndDate(event.endDate ?? "");
      setEventType(event.eventType !== undefined ? String(event.eventType) : "");
      setGameClubName(event.gameClubName ?? "");
      setId(event.id ?? "");
      setIsOnline(event.isOnline ?? false);
      setMaxPlayers(event.maxPlayers !== undefined ? String(event.maxPlayers) : "");
      setMinPlayers(event.minPlayers !== undefined ? String(event.minPlayers) : "");
      setName(event.name ?? "");
      setPrice(event.price !== undefined ? String(event.price) : "");
      setLocation(event.location ?? null);

      if (event.boardGameId !== undefined) {
        const bgId = String(event.boardGameId);
        setBoardGameId(bgId);

        const selectedGame = boardGames.find((g) => String(g.id) === bgId);
        setBoardGameName(selectedGame ? selectedGame.name : "");
      } else {
        setBoardGameId("");
        setBoardGameName("");
      }
    } else {
      setDescription("");
      setStartDate("");
      setEndDate("");
      setEventType("");
      setGameClubName("");
      setId("");
      setIsOnline(false);
      setMaxPlayers("");
      setMinPlayers("");
      setName("");
      setPrice("");
      setBoardGameId("");
      setBoardGameName("");
      setLocation(null);
    }
  }, [event, boardGames]);

  useEffect(() => {
    if (isOnline) {
      setLocation(null);
    }
  }, [isOnline]);

  const loadCityOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const result = await getCitiesBySearch(inputValue);
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((city) => ({
          label: city.shortName || city.fullName || "Unknown",
          value: city,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleCityChange = (selectedOption) => {
    setLocation(selectedOption ? selectedOption.value : null);
  };

  const handleBoardGameChange = (e) => {
    const selectedId = e.target.value;
    setBoardGameId(selectedId);
    const selectedGame = boardGames.find((g) => String(g.id) === selectedId);
    setBoardGameName(selectedGame ? selectedGame.name : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventTypeName = eventTypes.find((et) => et.id === Number(eventType))?.name || "";

    const fullLocationOsmId = location
      ? `${location.osmType ? location.osmType[0] : ""}${location.osmId}`
      : null;

    const updatedData = {
      id,
      description,
      startDate,
      endDate,
      eventType: Number(eventType),
      eventTypeName,
      gameClubName,
      isOnline,
      fullLocationOsmId,
      maxPlayers: maxPlayers ? Number(maxPlayers) : null,
      minPlayers: minPlayers ? Number(minPlayers) : null,
      name,
      price: price ? Number(price) : null,
      boardGameId: boardGameId ? Number(boardGameId) : null,
      boardGameName,
    };

    onSave(updatedData);
  };

  return (
    <>
      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .date-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }
        .date-row .form-group {
          width: 100%;
        }
      `}</style>

      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3 full-width">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <div className="form-grid">
              <Form.Group className="mb-3" controlId="formBoardGameId">
                <Form.Label>Board Game</Form.Label>
                <Form.Control
                  as="select"
                  value={boardGameId}
                  onChange={handleBoardGameChange}
                  required
                >
                  <option value="">Select a board game</option>
                  {boardGames.map((game) => (
                    <option key={game.id} value={game.id}>
                      {`${game.id} — ${game.name}`}
                    </option>
                  ))}
                </Form.Control>
                {boardGameName && (
                  <Form.Text className="text-muted">
                    Selected: {boardGameName}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEventType">
                <Form.Label>Event Type</Form.Label>
                <Form.Control
                  as="select"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>

            <div className="date-row full-width">
              <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3" controlId="formIsOnline">
              <Form.Check
                type="checkbox"
                label="Is Online"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>City</Form.Label>
              <AsyncSelect
                isClearable
                isDisabled={isOnline}
                cacheOptions
                defaultOptions
                loadOptions={loadCityOptions}
                onChange={handleCityChange}
                value={
                  location
                    ? {
                        label: location.shortName || location.fullName || "Unknown",
                        value: location,
                      }
                    : null
                }
                getOptionValue={(option) => option.value.osmId}
                getOptionLabel={(option) => option.label}
                placeholder={isOnline ? "Disabled for online events" : "Start typing city"}
                noOptionsMessage={() => "No cities found"}
              />
              {isOnline && (
                <Form.Text className="text-muted">
                  Location disabled for online events
                </Form.Text>
              )}
            </Form.Group>

            <div className="form-grid">
              <Form.Group className="mb-3" controlId="formMinPlayers">
                <Form.Label>Min Players</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={minPlayers}
                  onChange={(e) => setMinPlayers(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMaxPlayers">
                <Form.Label>Max Players</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3 full-width" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 full-width" controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 full-width" controlId="formGameClubName">
              <Form.Label>Game Club Name</Form.Label>
              <Form.Control
                type="text"
                value={gameClubName}
                onChange={(e) => setGameClubName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateEventModal;
