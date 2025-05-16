import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaTimes, FaTags, FaUsers, FaCogs, FaPalette } from 'react-icons/fa';

const iconMap = {
  categoryIds: <FaTags />,
  familiesIds: <FaUsers />,
  mechanicsIds: <FaCogs />,
  themeIds: <FaPalette />,
};

const SidebarFilters = ({ classifiers, filters, onFilterChange, onClearFilters, showFilters }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const renderMultiSelect = (label, key, items) => (
    <Card
      className="sidebar-card"
      onMouseEnter={() => setHoveredCard(key)}
      onMouseLeave={() => setHoveredCard(null)}
      style={hoveredCard === key ? { boxShadow: '0 6px 18px rgba(255, 140, 0, 0.4)' } : {}}
      key={key}
    >
      <Card.Body className="sidebar-card-body">
        <Card.Title className="sidebar-card-title">
          {iconMap[key]} {label}
        </Card.Title>
        <div className="sidebar-checkbox-container">
          {items?.length ? (
            items.map((item) => {
              const checked = (filters[key] || []).includes(item.id);
              return (
                <Form.Check
                  key={item.id}
                  type="checkbox"
                  id={`${key}-${item.id}`}
                  label={item.name}
                  checked={checked}
                  onChange={() => {
                    const newValues = checked
                      ? filters[key].filter((id) => id !== item.id)
                      : [...(filters[key] || []), item.id];
                    onFilterChange(key, newValues);
                  }}
                  className="sidebar-checkbox"
                />
              );
            })
          ) : (
            <div>No data</div>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className={`sidebar-container ${showFilters ? 'show' : 'hide'}`}>
      <div className="sidebar-header">Filters</div>
      {renderMultiSelect('Categories', 'categoryIds', classifiers.genres)}
      {renderMultiSelect('Families', 'familiesIds', classifiers.families)}
      {renderMultiSelect('Mechanics', 'mechanicsIds', classifiers.mechanics)}
      {renderMultiSelect('Themes', 'themeIds', classifiers.themes)}
      <div className="clear-button-wrapper">
        <Button variant="outline-warning" size="sm" className="clear-button" onClick={onClearFilters}>
          <FaTimes /> Clear
        </Button>
      </div>
    </div>
  );
};

export default SidebarFilters;
