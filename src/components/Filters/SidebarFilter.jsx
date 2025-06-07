import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaTimes, FaTags, FaUsers, FaCogs, FaPalette } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const iconMap = {
  categoryIds: <FaTags />,
  familiesIds: <FaUsers />,
  mechanicsIds: <FaCogs />,
  themeIds: <FaPalette />,
};

const SidebarFilters = ({ classifiers, filters, onFilterChange, onClearFilters, showFilters }) => {
  const { t } = useTranslation();

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
            <div>{t('sidebarFilters.noData')}</div>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className={`sidebar-container ${showFilters ? 'show' : 'hide'}`}>
      <div className="sidebar-header">{t('sidebarFilters.filters')}</div>
      {renderMultiSelect(t('sidebarFilters.categories'), 'categoryIds', classifiers.genres)}
      {renderMultiSelect(t('sidebarFilters.families'), 'familiesIds', classifiers.families)}
      {renderMultiSelect(t('sidebarFilters.mechanics'), 'mechanicsIds', classifiers.mechanics)}
      {renderMultiSelect(t('sidebarFilters.themes'), 'themeIds', classifiers.themes)}
      <div className="clear-button-wrapper">
        <Button variant="outline-warning" size="sm" className="clear-button" onClick={onClearFilters}>
          <FaTimes /> {t('sidebarFilters.clear')}
        </Button>
      </div>
    </div>
  );
};

export default SidebarFilters;
