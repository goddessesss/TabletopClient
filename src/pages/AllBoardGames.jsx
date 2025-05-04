import React, { useState, useEffect } from 'react';
import CustomPagination from '../components/Pagination.jsx';
import { getAllBoardGames, fetchClassifiers } from '../api/boardgameApi.js';
import BoardGameModal from '../components/BoardGameModal.jsx';
import Sidebar from '../components/SidebarFilters.jsx';
import { useFilterContext } from '../components/Context/FilterContext.jsx';
import { Badge, Spinner } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const AllBoardGames = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [search, setSearch] = useState('');
  const [classifiers, setClassifiers] = useState({
    genres: [],
    designers: [],
    families: [],
    mechanics: [],
    themes: [],
    publishers: [],
  });

  const {
    filters,
    updateFilter,
    clearFilters,
    removeSingleFilter,
  } = useFilterContext();

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
      setLoading(true);
      try {
        const data = await getAllBoardGames(currentPage, pageSize, search, filters);
        setGames(data.boardGames || []);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [currentPage, pageSize, search, filters]);

  const handleFilterChange = (event, key) => {
    const selected = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    updateFilter(key, selected);
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
    <div className="all-wrapper">
      <div className="all-container">
        <h2 className="mb-4">All Board Games</h2>

        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control"
            placeholder="Search by title..."
          />
        </div>

        <div className="mb-3">
          <strong>Selected filters:</strong>
          {hasSelectedFilters ? (
            <div className="mt-2">
              {Object.entries(filters).flatMap(([key, values]) =>
                values.map((id) => (
                  <Badge
                    key={`${key}-${id}`}
                    bg="secondary"
                    className="me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeSingleFilter(key, id)}
                  >
                    {getFilterLabel(key, id)} <FaTimes className="ms-1" />
                  </Badge>
                ))
              )}
            </div>
          ) : (
            <span className="mt-2 d-block">Filters not selected</span>
          )}
        </div>

        <div className="row">
          <Sidebar
            classifiers={classifiers}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          <div className="col-md-9">
            {loading ? (
              <div className="text-center mt-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : games.length === 0 ? (
              <p>No board games found.</p>
            ) : (
              <div className="row">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="col-md-4 mb-4"
                    onClick={() => handleGameClick(game.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card h-100">
                      <img
                        src={game.imageUrl}
                        className="card-img-top"
                        alt={game.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                          <h5 className="card-title">{game.name}</h5>
                          <p className="card-text">{game.description?.substring(0, 80)}...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {selectedGameId && (
          <BoardGameModal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setSelectedGameId(null);
            }}
            eventId={selectedGameId}
          />
        )}
      </div>
    </div>
  );
};

export default AllBoardGames;
