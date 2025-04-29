import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({});

  const updateFilter = (key, values) => {
    setFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const removeSingleFilter = (key, idToRemove) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((id) => id !== idToRemove),
    }));
  };

  const clearFilters = () => setFilters({});

  return (
    <FilterContext.Provider
      value={{ filters, updateFilter, removeSingleFilter, clearFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};
