import React from 'react';
import { Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const SidebarFilters = ({ classifiers, filters, onFilterChange, onClearFilters }) => {
  const renderMultiSelect = (label, key, items) => (
    <Form.Group className="mb-3" controlId={`filter-${key}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        multiple
        value={(filters[key] || []).map(String)}
        onChange={(e) => onFilterChange(e, key)}
      >
        {items.map((item) => (
          <option key={item.id} value={String(item.id)}>
            {filters[key]?.map(String).includes(String(item.id)) ? '✓ ' : ''}
            {item.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );

  return (
    <div className="col-md-3 mb-4">
      <h5>Filters</h5>
      {renderMultiSelect('Categories', 'categoryIds', classifiers.genres)}
      {renderMultiSelect('Families', 'familiesIds', classifiers.families)}
      {renderMultiSelect('Mechanics', 'mechanicsIds', classifiers.mechanics)}
      {renderMultiSelect('Themes', 'themeIds', classifiers.themes)}
      <button className="btn btn-outline-danger mt-2" onClick={onClearFilters}>
        <FaTimes className="me-1" /> Clear Filters
      </button>
    </div>
  );
};

export default SidebarFilters;
