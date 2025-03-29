import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar({ searchTerm, setSearchTerm }) {
  const handleChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  return (
    <Form.Control
      type="text"
      placeholder="Search events by name or genre..."
      className="search-bar"
      value={searchTerm} 
      onChange={handleChange} 
      style={{
        padding: '15px',
        backgroundColor: '#FFF9F0',
        borderRadius: '20px',
        width: '100%', 
        boxSizing: 'border-box',
      }}
    />
  );
}

export default SearchBar;
