import React, { useState, useEffect } from 'react';
import { getCitiesBySearch } from '../api/eventsApi.js';
import { Form, Button, Row, Col } from 'react-bootstrap';

const CitySearch = ({ setSelectedCity }) => {
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (citySearch.trim() === '') {
        setCitySuggestions([]);
        return;
      }

      const result = await getCitiesBySearch(citySearch);

      if (result.success) {
        setCitySuggestions(result.data);
      }
    };

    const delayDebounce = setTimeout(fetchCities, 500);
    return () => clearTimeout(delayDebounce);
  }, [citySearch]);

  return (
    <div>
      <Row className="mb-4">
        <Col md={6} className="position-relative">
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
          {citySuggestions.length > 0 && (
            <ul
              className="list-group position-absolute w-100 z-3"
              style={{ maxHeight: '200px', overflowY: 'auto' }}
            >
              {citySuggestions.map((city, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSelectedCity(city);
                    setCitySearch(city.shortName);
                    setCitySuggestions([]);
                  }}
                >
                  {city.shortName}
                </li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CitySearch;
