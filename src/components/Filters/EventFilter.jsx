import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
} from 'react-icons/fa';
import { getCitiesBySearch } from '../../api/eventsApi.js';

const EventFilter = ({
  isOnlineFilter,
  setIsOnlineFilter,
  selectedCity,
  setSelectedCity,
  minAvaliableSlots,
  setMinAvailableSlots,
  maxPrice,
  setMaxPrice,
  sorting,
  setSorting,
  minDate,
  setMinDate,
  maxDate,
  setMaxDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const debounceTimeout = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [hasUserSelectedCity, setHasUserSelectedCity] = useState(false);

  useEffect(() => {
    if (
      !searchTerm.trim() ||
      (hasUserSelectedCity && searchTerm === selectedCityName)
    ) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      if (!searchTerm.trim()) {
        setSelectedCity(null);
        setSelectedCityName(null);
        setHasUserSelectedCity(false);
      }
      setLoadingCities(false);
      return;
    }

    setLoadingCities(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      const result = await getCitiesBySearch(searchTerm.trim());

      if (result.success) {
        setCitySuggestions(result.data);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }

      setLoadingCities(false);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, selectedCityName, hasUserSelectedCity]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCityName(null);
    setHasUserSelectedCity(false);
    if (e.target.value === '') {
      setSelectedCity(null);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setSelectedCity({ latitude: city.latitude, longitude: city.longitude });
    setSearchTerm(city.fullName);
    setSelectedCityName(city.fullName);
    setShowSuggestions(false);
    setHasUserSelectedCity(true);
  };

  const toggleSort = (field) => {
    const currentValue = sorting[field];
    const newValue = currentValue === null ? 1 : currentValue === 1 ? 0 : null;

    setSorting({
      startDate: null,
      price: null,
      participantsCount: null,
      [field]: newValue,
    });
  };

  const renderSortIcon = (field) => {
    if (sorting[field] === 1) return <FaSortUp />;
    if (sorting[field] === 0) return <FaSortDown />;
    return <FaSort />;
  };

  const clearFilters = () => {
    setIsOnlineFilter(null);
    setSelectedCity(null);
    setSearchTerm('');
    setSelectedCityName(null);
    setHasUserSelectedCity(false);
    setMinAvailableSlots(null);
    setMaxPrice(null);
    setSorting({ startDate: null, price: null, participantsCount: null });
    setMinDate(null);
    setMaxDate(null);
  };

  return (
    <div
      className="d-flex flex-column gap-4"
      style={{
        position: 'relative',
        borderRadius: '12px',
        padding: '30px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Form.Group>
        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
          <FaFilter /> Event Format
        </Form.Label>
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant={isOnlineFilter === null ? 'secondary' : 'outline-secondary'}
            className="rounded-pill px-3 py-1"
            onClick={() => setIsOnlineFilter(null)}
          >
            All
          </Button>
          <Button
            variant={isOnlineFilter === true ? 'success' : 'outline-success'}
            className="rounded-pill px-3 py-1"
            onClick={() => setIsOnlineFilter(true)}
          >
            <FaGlobe className="me-1" /> Online
          </Button>
          <Button
            variant={isOnlineFilter === false ? 'primary' : 'outline-primary'}
            className="rounded-pill px-3 py-1"
            onClick={() => setIsOnlineFilter(false)}
          >
            <FaMapMarkerAlt className="me-1" /> Offline
          </Button>
        </div>
      </Form.Group>

      <Form.Group style={{ position: 'relative' }}>
        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
          <FaMapMarkerAlt /> City (optional)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="For example: Kyiv"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (citySuggestions.length > 0 && !hasUserSelectedCity) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="shadow-sm"
          autoComplete="off"
        />
        {loadingCities && (
          <div className="city-loading-box">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {showSuggestions && citySuggestions.length > 0 && (
          <ListGroup className="city-suggestion-box">
            {citySuggestions.map((city) => (
              <ListGroup.Item
                key={city.osmId || city.shortName}
                action
                onMouseDown={() => handleSelectCity(city)}
              >
                {city.fullName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
          <FaUsers /> Min Available Slots
        </Form.Label>
        <Form.Control
          type="number"
          min={0}
          placeholder="Minimum available slots"
          value={minAvaliableSlots
             ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            setMinAvailableSlots(val === '' ? null : Number(val));
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
          <FaDollarSign />Price
        </Form.Label>
        <Form.Control
          type="number"
          min={0}
          placeholder="Maximum price"
          value={maxPrice ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            setMaxPrice(val === '' ? null : Number(val));
          }}
        />
      </Form.Group>

     <Form.Group controlId="minDateTime">
  <Form.Label className="fw-semibold d-flex align-items-center gap-2">
    <FaCalendarAlt /> From Date
  </Form.Label>
  <Form.Control
    type="datetime-local"
    value={minDate ? minDate.toISOString().slice(0, 16) : ''}
    onChange={(e) => {
      setMinDate(e.target.value ? new Date(e.target.value) : null);
    }}
  />
</Form.Group>

<Form.Group controlId="maxDateTime">
  <Form.Label className="fw-semibold d-flex align-items-center gap-2">
    <FaCalendarAlt /> To Date
  </Form.Label>
  <Form.Control
    type="datetime-local"
    value={maxDate ? maxDate.toISOString().slice(0, 16) : ''}
    onChange={(e) => {
      setMaxDate(e.target.value ? new Date(e.target.value) : null);
    }}
  />
</Form.Group>


      <Form.Group>
        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
          <FaSort /> Sort by
        </Form.Label>
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant={sorting.startDate !== null ? 'primary' : 'outline-primary'}
            className="rounded-pill px-3 py-1 d-flex align-items-center gap-1"
            onClick={() => toggleSort('startDate')}
          >
            <FaCalendarAlt /> Date {renderSortIcon('startDate')}
          </Button>
          <Button
            variant={sorting.price !== null ? 'success' : 'outline-success'}
            className="rounded-pill px-3 py-1 d-flex align-items-center gap-1"
            onClick={() => toggleSort('price')}
          >
            <FaDollarSign /> Price {renderSortIcon('price')}
          </Button>
          <Button
            variant={sorting.participantsCount !== null ? 'info' : 'outline-info'}
            className="rounded-pill px-3 py-1 d-flex align-items-center gap-1"
            onClick={() => toggleSort('participantsCount')}
          >
            <FaUsers /> Participants {renderSortIcon('participantsCount')}
          </Button>
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="danger" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default EventFilter;
