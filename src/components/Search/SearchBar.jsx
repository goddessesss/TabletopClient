import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <Form.Control 
      type="text" 
      placeholder="Search events by name or genre..." 
      className="search-bar" 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)} 
      style={{ padding: '15px', backgroundColor: '#FFF9F0', borderRadius: '20px' }} 
    />
  );
}

export default SearchBar;
