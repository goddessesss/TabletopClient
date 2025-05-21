import React, { useState, useEffect } from 'react';
import { Badge, Button, Offcanvas } from 'react-bootstrap'; 
import { FaTimes, FaFilter } from 'react-icons/fa';
import BoardGameList from '../components/BoardGame/BoardGameList.jsx';
import CustomPagination from '../components/Pagination.jsx';
import BoardGameModal from '../components/BoardGameModal.jsx';
import SidebarFilters from '../components/Filters/SidebarFilter.jsx';
import { useFilterContext } from '../components/Context/FilterContext.jsx';
import { getAllBoardGames, fetchClassifiers } from '../api/boardgameApi.js';
import SearchBar from '../components/SearchBar.jsx'; 
import { useTranslation } from 'react-i18next';

const AllBoardGames = () => {
  const { t } = useTranslation();

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
  const [showFiltersOffcanvas, setShowFiltersOffcanvas] = useState(false);

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
    <div className="all-wrapper" style={{ minHeight: '100vh', color: '#333' }}>
      <div className="all-container">

        <div className="search-wrapper mb-3 d-flex align-items-center" style={{ gap: '1rem' }}>
          <SearchBar 
            value={search} 
            onChange={(value) => setSearch(value)} 
            placeholder={t('search.placeholder')} 
          />
          <div className="d-md-none">
            <Button
              variant="warning"
              onClick={() => setShowFiltersOffcanvas(true)} 
              title={t('filters.openFilters')}
            >
              <FaFilter />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <strong>{t('filters.selectedFilters')}</strong>
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
            <span className="mt-2 d-block">{t('filters.noFiltersSelected')}</span>
          )}
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div></div>
          <div style={{ marginLeft: 'auto' }}>
            <label htmlFor="pageSize">{t('pagination.gamesPerPage')} </label>
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

          <div className="games-content" style={{ flexGrow: 1 }}>
            {games.length === 0 ? (
              <div className="text-center" style={{ fontSize: '1.25rem' }}>
                {t('games.noResultsFound')}
              </div>
            ) : (
              <>
                <BoardGameList games={games} onGameClick={handleGameClick} />
                <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </div>

        <BoardGameModal show={showModal} onHide={() => setShowModal(false)} gameId={selectedGameId} />

        <Offcanvas
          show={showFiltersOffcanvas}
          onHide={() => setShowFiltersOffcanvas(false)}
          placement="start"
          scroll={true}
          backdrop={true}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{t('filters.title')}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <SidebarFilters
              classifiers={classifiers}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default AllBoardGames;
