import React, { useState, useEffect } from 'react';
import { getCitiesBySearch, addEvent, getEventTypes } from '../api/eventsApi.js';
import { useAuth } from '../components/Context/AuthContext.jsx';

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
    eventType: 0,
    price: 0,
    organizerPlayerId: 0,
  });

  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        organizerPlayerId: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const result = await getEventTypes();
        setEventTypes(result);
      } catch (error) {
        console.error('Error fetching event types:', error);
        setError(error.message);
      }
    };
    fetchEventTypes();
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
      if (result.success) {
        if (Array.isArray(result.data)) {
          const options = result.data.map((item) => ({
            value: item.osmType + item.osmId,
            label: item.shortName || 'Unknown city',
          }));
          setCityOptions(options);
        } else {
          throw new Error('Unexpected response format: "data" is not an array');
        }
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error during city search:', error);
      setError(error.message);
      setCityOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setInputValue(city.label);

    const osmId = city.value.charAt(0) + city.value.slice(8);

    setFormData((prev) => ({
      ...prev,
      fullLocationOsmId: osmId,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOsmId(formData.fullLocationOsmId)) {
      setSubmitMessage('Invalid location format.');
      setSubmitMessageType('error');
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
      return;
    }

    if (!formData.eventType) {
      setSubmitMessage('Event type is required.');
      setSubmitMessageType('error');
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
      return;
    }

    const osmType = formData.fullLocationOsmId.charAt(0);
    const osmId = formData.fullLocationOsmId.slice(1);

    try {
      const eventPayload = {
        ...formData,
        fullLocationOsmId: osmType + osmId,
        maxPlayers: Number(formData.maxPlayers),
        minPlayers: Number(formData.minPlayers),
        price: Number(formData.price),
        organizerPlayerId: Number(formData.organizerPlayerId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        eventType: Number(formData.eventType),
      };

      const result = await addEvent(eventPayload);
      if (result.success) {
        setSubmitMessage('Event successfully created!');
        setSubmitMessageType('success');
        setTimeout(() => {
          setSubmitMessage('');
        }, 3000);
      } else {
        setSubmitMessage('Error: ' + result.message);
        setSubmitMessageType('error');
        setTimeout(() => {
          setSubmitMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      setSubmitMessage('Error creating event.');
      setSubmitMessageType('error');
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
    }
  };

  const isValidOsmId = (osmId) => {
    return osmId && osmId.length > 1 && /^[a-zA-Z]/.test(osmId.charAt(0));
  };

  return (
    <div className="container mt-4">
      {submitMessage && (
        <div className={`alert ${submitMessageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {submitMessage}
        </div>
      )}

      <h2 className="mb-4">Add Event</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className="form-control"
            required
          />
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

        <div className="mb-3">
          <label className="form-label">Minimum number of players</label>
          <input
            type="number"
            name="minPlayers"
            value={formData.minPlayers}
            onChange={handleFormChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Maximum number of players</label>
          <input
            type="number"
            name="maxPlayers"
            value={formData.maxPlayers}
            onChange={handleFormChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date <span style={{ color: 'red' }}>*</span></label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleFormChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date <span style={{ color: 'red' }}>*</span></label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleFormChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Online Event? <span style={{ color: 'red' }}>*</span></label>
          <select
            name="isOnline"
            value={formData.isOnline}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isOnline: e.target.value === 'true',
              }))
            }
            className="form-select"
            required
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Start typing city"
            className="form-control custom-input"
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

        <div className="mb-3">
          <label className="form-label">Event Type <span style={{ color: 'red' }}>*</span></label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleFormChange}
            className="form-select"
            required
          >
            <option value="" disabled>Choose event type</option>
            {eventTypes.map((eventType) => (
              <option key={eventType.id} value={eventType.id}>
                {eventType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleFormChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Event
        </button>
      </form>
    </div>
  );
}

export default AddEvent;
