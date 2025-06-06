import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { getCitiesBySearch } from "../../api/eventsApi.js";
import { getBoardGamesNames } from "../../api/boardgameApi.js";

const eventTypes = [
  { id: 0, name: "GameSession" },
  { id: 1, name: "Tournament" },
  { id: 2, name: "Meetup" },
  { id: 3, name: "Convention" },
  { id: 4, name: "Other" },
];

function getCurrentDateTimeLocal() {
  const now = new Date();
  const pad = (num) => num.toString().padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

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
  const [errorMessage, setErrorMessage] = useState("");

  const timeoutRef = useRef(null);

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
    setErrorMessage("");
  }, [event, boardGames]);

  useEffect(() => {
    if (isOnline) {
      setLocation(null);
    }
  }, [isOnline]);

  const loadCityOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await getCitiesBySearch(inputValue);
        if (result.success && Array.isArray(result.data)) {
          callback(
            result.data.map((city) => ({
              label: city.fullName || city.shortName || "Unknown",
              value: city,
            }))
          );
        } else {
          callback([]);
        }
      } catch {
        callback([]);
      }
    }, 500);
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
    setErrorMessage("");
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now) {
      setErrorMessage("Start date/time cannot be in the past.");
      return;
    }

    if (end < now) {
      setErrorMessage("End date/time cannot be in the past.");
      return;
    }

    if (end < start) {
      setErrorMessage("End date/time cannot be earlier than start date/time.");
      return;
    }

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

  const minDateTime = getCurrentDateTimeLocal();

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
        .error-message {
          color: red;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .required-star {
          color: red;
          margin-left: 4px;
        }
      `}</style>

      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        centered
        backdrop="static"
        keyboard={!saving}
      >
        <Modal.Header closeButton={!saving}>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <Form.Group className="mb-3 full-width">
              <Form.Label>
                Event Name<span className="required-star">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={saving}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
              />
            </Form.Group>

            <div className="form-grid">
              <Form.Group className="mb-3">
                <Form.Label>
                  Board Game<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={boardGameId}
                  onChange={handleBoardGameChange}
                  required
                  disabled={saving}
                >
                  <option value="">Select a board game</option>
                  {boardGames.map((game) => (
                    <option key={game.id} value={game.id}>
                      {`${game.id} — ${game.name}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Event Type<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                  disabled={saving}
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

            <Form.Group className="mb-3">
              <Form.Label>Game Club</Form.Label>
              <Form.Control
                type="text"
                value={gameClubName}
                onChange={(e) => setGameClubName(e.target.value)}
                disabled={saving}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Online Event"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                disabled={saving}
              />
            </Form.Group>

            {!isOnline && (
              <Form.Group className="mb-3">
                <Form.Label>
                  City<span className="required-star">*</span>
                </Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCityOptions}
                  onChange={handleCityChange}
                  isDisabled={saving}
                  placeholder="Search for a city..."
                  value={
                    location
                      ? {
                          label: location.fullName || location.shortName || "Unknown",
                          value: location,
                        }
                      : null
                  }
                />
              </Form.Group>
            )}

            <div className="date-row">
              <Form.Group className="mb-3">
                <Form.Label>
                  Start Date/Time<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={minDateTime}
                  required
                  disabled={saving}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  End Date/Time<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || minDateTime}
                  required
                  disabled={saving}
                />
              </Form.Group>
            </div>

            <div className="form-grid">
              <Form.Group className="mb-3">
                <Form.Label>
                  Min Players<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={minPlayers}
                  onChange={(e) => setMinPlayers(e.target.value)}
                  required
                  disabled={saving}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Max Players<span className="required-star">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  required
                  disabled={saving}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={saving}
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
