import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { getCitiesBySearch, addEvent } from '../api/eventsApi.js';
import { getBoardGamesNames } from '../api/boardgameApi.js';
import { useAuth } from '../components/Context/AuthContext.jsx';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';
import { useNotifications } from '../components/NotificationsHandling/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getClubOwnerGameClubs } from '../api/gameClubsApi.js';
import { roles } from '../enums/roles.js';

function AddEvent() {
  const debounceTimeout = useRef(null);
  const { userId, userRole } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
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
  const [inputValue, setInputValue] = useState('');
  const [boardGames, setBoardGames] = useState([]);
  const [gameClubs, setGameClubs] = useState([]);
  const [isClubEvent, setIsClubEvent] = useState(false);
  const [selectedGameClub, setSelectedGameClub] = useState(null);

  const eventTypes = [
    { id: 0, name: 'Game Session' },
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
    async function fetchGameClubs() {
      const result = await getClubOwnerGameClubs();
      if (result.success) {
        setGameClubs(result.data);
      }
    }
    fetchBoardGames();
    fetchGameClubs();
  }, []);

  const handleCitySearch = async (inputValue) => {
    if (!inputValue) {
      setCityOptions([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getCitiesBySearch(inputValue);
      if (result.success && Array.isArray(result.data)) {
        const options = result.data.map((item) => ({
          value: item.osmType.charAt(0) + item.osmId,
          label: item.fullName || item.shortName || 'Unknown location',
        }));
        setCityOptions(options);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
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
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleCitySearch(value);
    }, 500);
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

  const handleGameClubSelect = (selectedOption) => {
    setSelectedGameClub(selectedOption);
    setLocationFromGameClub(selectedOption);
  }

  const setLocationFromGameClub = (selectedOption) => {
    if (selectedOption == null)
      return;

    var selectedLocation = {
      value: selectedOption.location.osmType.charAt(0) + selectedOption.location.osmId,
      label: selectedOption.location.fullName || selectedOption.location.shortName || 'Unknown location',
    }

    setSelectedCity(selectedLocation)
    setInputValue(selectedLocation.label)
  }

  const isValidOsmId = (osmId) => {
    return osmId && osmId.length > 1 && /^[a-zA-Z]/.test(osmId.charAt(0));
  };

  const displayMessage = (msg, type) => {
    addNotification({message: msg, variant: type});
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
      displayMessage('Event type is required.', 'danger');
      return;
    }
    if (!formData.isOnline && !isValidOsmId(formData.fullLocationOsmId)) {
      displayMessage('Invalid location format.', 'danger');
      return;
    }
    if (isDateInPast(formData.startDate)) {
      displayMessage('Start date cannot be in the past.', 'danger');
      return;
    }
    if (isDateInPast(formData.endDate)) {
      displayMessage('End date cannot be in the past.', 'danger');
      return;
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      displayMessage('End date cannot be earlier than start date.', 'danger');
      return;
    }

    try {
      const eventPayload = {
        ...formData,
        maxPlayers: formData.maxPlayers == '' ? null : Number(formData.maxPlayers),
        minPlayers: formData.minPlayers == '' ? null : Number(formData.minPlayers),
        price: Number(formData.price),
        organizerPlayerId: Number(formData.organizerPlayerId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        eventType: Number(formData.eventType),
        gameClubId: selectedGameClub?.id
      };

      if (formData.isOnline) {
        delete eventPayload.fullLocationOsmId;
      }

      const result = await addEvent(eventPayload);
      if (result.success) {
        displayMessage('Event successfully created', 'success');
        navigate('/events');
      }
    } catch {
      displayMessage('Error creating event.', 'danger');
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
              <label className="form-label">Location</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Start typing location name"
                className="form-control"
              />
              {isLoading && <p>Loading...</p>}
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

            { userRole === roles.find(role => role.name === 'Club Owner')?.id && ( <>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isClubEvent"
                  checked={isClubEvent}
                  onChange={(e) => setIsClubEvent(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isClubEvent">
                  This is a Club Event
                </label>
              </div>

              { isClubEvent && (
                <div className="mb-3">
                  <label className="form-label">Game Club</label>
                  <Select
                    options={gameClubs}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    onChange={handleGameClubSelect}
                    isClearable
                    placeholder={'Select game club'}
                    value={selectedGameClub || null}
                  />
                </div>
              )}
            </>)}

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