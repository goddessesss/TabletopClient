import React, { useState, useEffect } from 'react';
import { Badge, InputGroup, Form, Button } from 'react-bootstrap';
import { FaTimes, FaSearch, FaFilter } from 'react-icons/fa';

import BoardGameList from '../components/BoardGame/BoardGameList.jsx';
import CustomPagination from '../components/Pagination.jsx';
import BoardGameModal from '../components/BoardGameModal.jsx';
import SidebarFilters from '../components/Filters/SidebarFilter.jsx';
import { useFilterContext } from '../components/Context/FilterContext.jsx';
import { getAllBoardGames, fetchClassifiers } from '../api/boardgameApi.js';

const AllBoardGames = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [showModal, setShowModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [search, setSearch] = useState('');
  const [classifiers, setClassifiers] = useState({
    genres: [],
    families: [],
    mechanics: [],
    themes: [],
  });
  const [mobileShowFilters, setMobileShowFilters] = useState(false);

  const { filters, updateFilter, clearFilters, removeSingleFilter } = useFilterContext();

  useEffect(() => {
    const fetchClassifiersData = async () => {
      try {
        const data = await fetchClassifiers();
        setClassifiers(data);
      } catch (error) {
        console.error('Failed to fetch classifiers:', error);
      }
    };
    fetchClassifiersData();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getAllBoardGames(currentPage, pageSize, search, filters);
        setGames(data.boardGames || []);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };
    fetchGames();
  }, [currentPage, pageSize, search, filters]);

  const handleFilterChange = (key, newValues) => {
    updateFilter(key, newValues);
    setCurrentPage(1);
  };

  const getFilterLabel = (key, id) => {
    const map = {
      categoryIds: classifiers.genres,
      familiesIds: classifiers.families,
      mechanicsIds: classifiers.mechanics,
      themeIds: classifiers.themes,
    };
    return map[key]?.find((el) => el.id === id)?.name || id;
  };

  const handleGameClick = (id) => {
    setSelectedGameId(id);
    setShowModal(true);
  };

  const hasSelectedFilters = Object.values(filters).some((filter) => filter.length > 0);

  return (
    <div className="d-flex justify-content-center align-items-center all-wrapper" style={{ minHeight: '100vh', color: '#333' }}>
      <div className="all-container" style={{ width: '100%', maxWidth: '1700px', padding: '50px', background: '#fafafa', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}>
        <div className="search-wrapper mb-3 d-flex align-items-center" style={{ gap: '1rem' }}>
          <InputGroup className="shadow-sm rounded flex-grow-1">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search games"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderLeft: 'none' }}
            />
          </InputGroup>
          <div className="d-md-none">
            <Button
              variant="warning"
              onClick={() => setMobileShowFilters(!mobileShowFilters)}
              title={mobileShowFilters ? 'Close filters' : 'Open filters'}
            >
              <FaFilter />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <strong>Selected filters:</strong>
          {hasSelectedFilters ? (
            <div className="mt-2">
              {Object.entries(filters).flatMap(([key, values]) =>
                values.map((id) => (
                  <Badge
                    key={`${key}-${id}`}
                    bg="warning"
                    text="dark"
                    className="me-2"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '20px',
                      fontSize: '1rem',
                      padding: '0.6rem 1rem',
                    }}
                    onClick={() => removeSingleFilter(key, id)}
                  >
                    {getFilterLabel(key, id)} <FaTimes className="ms-1" />
                  </Badge>
                ))
              )}
            </div>
          ) : (
            <span className="mt-2 d-block">No filters selected</span>
          )}
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div></div>
          <div style={{ marginLeft: 'auto' }}>
            <label htmlFor="pageSize">Games per page: </label>
            <select
              id="pageSize"
              className="form-select"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                if (newSize < 9) return;
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="d-flex" style={{ gap: '1rem' }}>
          <div className="col-md-3 d-none d-md-block" style={{ minWidth: '320px' }}>
            <SidebarFilters
              classifiers={classifiers}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {mobileShowFilters && (
            <div className="position-fixed top-0 start-0 bg-white shadow" style={{ height: '100vh', zIndex: 1050, overflowY: 'auto', borderRight: '1px solid #ddd', paddingTop: '3.5rem' }}>
              <Button
                variant="light"
                onClick={() => setMobileShowFilters(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 1060,
                  borderRadius: '50%',
                  padding: '0.5rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaTimes />
              </Button>
              <div className="p-3">
                <SidebarFilters
                  classifiers={classifiers}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          <div className="games-content">
            <BoardGameList games={games} onGameClick={handleGameClick} />
            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>

        <BoardGameModal show={showModal} onHide={() => setShowModal(false)} gameId={selectedGameId} />
      </div>
    </div>
  );
};

export default AllBoardGames;
