import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange }) => {
  return (
    <InputGroup className="shadow-sm mb-3" style={{ borderRadius: '1rem' }}>
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search events"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderLeft: 'none', borderRadius: '0 1rem 1rem 0' }}
      />
    </InputGroup>
  );
};

export default SearchBar;
