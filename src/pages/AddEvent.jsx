import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getCitiesBySearch, addEvent } from '../api/eventsApi.js';
import { getBoardGamesNames } from '../api/boardgameApi.js';
import { useAuth } from '../components/Context/AuthContext.jsx';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';

function AddEvent() {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxPlayers: 0,
    minPlayers: 0,
    startDate: '',
    endDate: '',
    isOnline: true,
    fullLocationOsmId: '',
    eventType: '',
    price: 0,
    organizerPlayerId: 0,
    boardGameId: '',
  });

  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');
  const [boardGames, setBoardGames] = useState([]);

  const eventTypes = [
    { id: 0, name: 'GameSession' },
    { id: 1, name: 'Tournament' },
    { id: 2, name: 'Meetup' },
    { id: 3, name: 'Convention' },
    { id: 4, name: 'Other' },
  ];

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        organizerPlayerId: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    async function fetchBoardGames() {
      const result = await getBoardGamesNames('');
      if (result.success) {
        const options = result.data.map((game) => ({
          value: game.id,
          label: game.name,
        }));
        setBoardGames(options);
      }
    }
    fetchBoardGames();
  }, []);

  const handleCitySearch = async (inputValue) => {
    if (!inputValue) {
      setCityOptions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCitiesBySearch(inputValue);
      if (result.success && Array.isArray(result.data)) {
        const options = result.data.map((item) => ({
          value: item.osmType.charAt(0) + item.osmId,
          label: item.shortName || 'Unknown city',
        }));
        setCityOptions(options);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      setError(error.message);
      setCityOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setInputValue(city.label);
    setFormData((prev) => ({
      ...prev,
      fullLocationOsmId: city.value,
    }));
    setCityOptions([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleCitySearch(value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBoardGameChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      boardGameId: selectedOption ? selectedOption.value : '',
    }));
  };

  const isValidOsmId = (osmId) => {
    return osmId && osmId.length > 1 && /^[a-zA-Z]/.test(osmId.charAt(0));
  };

  const displayMessage = (msg, type) => {
    setSubmitMessage(msg);
    setSubmitMessageType(type);
    setTimeout(() => setSubmitMessage(''), 3000);
  };

  const isDateInPast = (dateString) => {
    if (!dateString) return false;
    const now = new Date();
    const date = new Date(dateString);
    return date < now;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.eventType === '') {
      displayMessage('Event type is required.', 'error');
      return;
    }

    if (!formData.isOnline && !isValidOsmId(formData.fullLocationOsmId)) {
      displayMessage('Invalid location format.', 'error');
      return;
    }

    if (isDateInPast(formData.startDate)) {
      displayMessage('Start date cannot be in the past.', 'error');
      return;
    }
    if (isDateInPast(formData.endDate)) {
      displayMessage('End date cannot be in the past.', 'error');
      return;
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      displayMessage('End date cannot be earlier than start date.', 'error');
      return;
    }

    try {
      const eventPayload = {
        ...formData,
        maxPlayers: Number(formData.maxPlayers),
        minPlayers: Number(formData.minPlayers),
        price: Number(formData.price),
        organizerPlayerId: Number(formData.organizerPlayerId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        eventType: Number(formData.eventType),
      };

      if (formData.isOnline) {
        delete eventPayload.fullLocationOsmId;
      }

      const result = await addEvent(eventPayload);
      if (result.success) {
        displayMessage('Event successfully created!', 'success');
        setFormData({
          name: '',
          description: '',
          maxPlayers: 0,
          minPlayers: 0,
          startDate: '',
          endDate: '',
          isOnline: true,
          fullLocationOsmId: '',
          eventType: '',
          price: 0,
          organizerPlayerId: userId,
          boardGameId: '',
        });
        setSelectedCity(null);
        setInputValue('');
      } else {
        displayMessage('Error: ' + result.message, 'error');
      }
    } catch {
      displayMessage('Error creating event.', 'error');
    }
  };

  return (
    <div className="create-event-wrapper">
      <div className="container my-2">
        <div className="pt-4">
            <BreadCrumbs
              items={[
                { label: 'Home', path: '/' },
                { label: 'Events', path: '/events' },
                { label: 'Create event'}
              ]}
            />
        </div>
        <h1 className="fw-bold mb-0">Create Event</h1>
      </div>

      <div className="create-event-container mt-4">
        {submitMessage && (
          <div className={`alert ${submitMessageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Event Type <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleFormChange}
                className="form-select"
                required
              >
                <option value="" disabled>
                  Choose event type
                </option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="form-control"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Minimum Players</label>
              <input
                type="number"
                name="minPlayers"
                value={formData.minPlayers}
                onChange={handleFormChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Maximum Players</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleFormChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Start Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                className="form-control"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                End Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
                className="form-control"
                required
                min={formData.startDate || new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Online Event? <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="isOnline"
              value={formData.isOnline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isOnline: e.target.value === 'true' }))
              }
              className="form-select"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {!formData.isOnline && (
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Start typing city"
                className="form-control"
              />
              {isLoading && <p>Loading...</p>}
              {error && <p className="text-danger">Error: {error}</p>}
              {cityOptions.length > 0 && (
                <ul className="list-group mt-2">
                  {cityOptions.map((city) => (
                    <li
                      key={city.value}
                      onClick={() => handleCitySelect(city)}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      >
                      {city.label}
                      </li>
                      ))}
                      </ul>
                      )}
                      </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Board Game</label>
                        <Select
                          options={boardGames}
                          onChange={handleBoardGameChange}
                          isClearable
                          placeholder="Select board game"
                          value={boardGames.find((g) => g.value === formData.boardGameId) || null}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleFormChange}
                          className="form-control"
                          min="0"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: '#fbc02d', color: 'black' }}
                      >
                        Create Event
                      </button>
                    </form>
                  </div>
                </div>
              );
            }

export default AddEvent;