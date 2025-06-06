import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../components/Pagination.jsx';
import { getAllEvents, fetchCityName } from '../api/eventsApi.js';
import {
  Spinner,
  Button,
  Offcanvas,
  InputGroup,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import EventFilter from '../components/Filters/EventFilter.jsx';
import EventList from '../components/Events/EventList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';
import { useTranslation } from 'react-i18next';

const Events = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(6);
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [isOnlineFilter, setIsOnlineFilter] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [minAvailableSlots, setMinAvailableSlots] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState({ participantsCount: null, price: null, startDate: null });
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  const fetchCityNameAsync = async (latitude, longitude) => {
    try {
      return await fetchCityName(latitude, longitude);
    } catch {
      return 'Unknown city';
    }
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const minDateISO = minDate instanceof Date ? minDate.toISOString() : null;
      const maxDateISO = maxDate instanceof Date ? maxDate.toISOString() : null;

      const queryFilters = {
        isOnline: isOnlineFilter === null ? [] : [isOnlineFilter],
        latitude: selectedCity?.latitude ?? null,
        longitude: selectedCity?.longitude ?? null,
        minAvailableSlots: minAvailableSlots,
        maxPrice: maxPrice,
        minDate: minDateISO,
        maxDate: maxDateISO,
        eventTypes: selectedEventTypes.length > 0 ? selectedEventTypes : [],
      };

      const filtersToSend =
        Object.values(queryFilters).every(
          (val) => val === null || val === 0 || (Array.isArray(val) && val.length === 0)
        )
          ? {}
          : queryFilters;

      const data = await getAllEvents(currentPage, pageSize, search, filtersToSend, sorting);

      if (data && data.events) {
        setEvents(data.events);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } else {
        setEvents([]);
        setTotalPages(1);
        setCityNamesByEventId({});
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    search,
    isOnlineFilter,
    selectedCity,
    minAvailableSlots,
    maxPrice,
    sorting,
    minDate,
    maxDate,
    selectedEventTypes,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    isOnlineFilter,
    selectedCity,
    minAvailableSlots,
    maxPrice,
    sorting,
    minDate,
    maxDate,
    selectedEventTypes,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, currentPage]);

  const handleEventClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
   <div className="container my-2">
    <div className="pt-4">
      <BreadCrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Events' },
        ]}
      />
    </div>
    <div className="d-flex align-items-center justify-content-between mb-2 px-2">
      <h1 className="fw-bold mb-0">Events</h1>
      <Button
        variant="warning"
        onClick={() => navigate('/events/addevent')}
        className="d-none d-md-flex align-items-center"
      >
        <FaPlus className="me-2" />
        Create Event
      </Button>

      <Button
        variant="warning"
        onClick={() => navigate('/events/add')}
        className="d-flex d-md-none align-items-center justify-content-center p-2"
        style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
        aria-label="Create Event"
      >
        <FaPlus />
      </Button>
    </div>

    <Row>
      <Col md={4} className="d-none d-md-block overflow-auto" style={{ maxHeight: '80vh' }}>
        <EventFilter
          isOnlineFilter={isOnlineFilter}
          setIsOnlineFilter={setIsOnlineFilter}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          minAvailableSlots={minAvailableSlots}
          setMinAvailableSlots={setMinAvailableSlots}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sorting={sorting}
          setSorting={setSorting}
          minDate={minDate}
          setMinDate={setMinDate}
          maxDate={maxDate}
          setMaxDate={setMaxDate}
          selectedEventTypes={selectedEventTypes}
          setSelectedEventTypes={setSelectedEventTypes}
        />
      </Col>

      <Col xs={12} md={8} className="d-flex flex-column gap-3">
        <div className="d-flex d-md-none mb-3 gap-2">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button variant="warning" onClick={() => setShowFilterSidebar(true)}>
            <FaFilter />
          </Button>
        </div>

        <div className="d-none d-md-block mb-3">
          <SearchBar value={search} onChange={setSearch} placeholder={t('search.eventsPlaceholder')} />
        </div>

        <div className="flex-grow-1" style={{ minHeight: '300px' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center fs-5 text-muted">{t('search.noResultsFound')}</p>
          ) : (
            <EventList
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </div>

        <div className="d-flex justify-content-center mt-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Col>
    </Row>

    <Offcanvas show={showFilterSidebar} onHide={() => setShowFilterSidebar(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <EventFilter
          isOnlineFilter={isOnlineFilter}
          setIsOnlineFilter={setIsOnlineFilter}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          minAvailableSlots={minAvailableSlots}
          setMinAvailableSlots={setMinAvailableSlots}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sorting={sorting}
          setSorting={setSorting}
          minDate={minDate}
          setMinDate={setMinDate}
          maxDate={maxDate}
          setMaxDate={setMaxDate}
          selectedEventTypes={selectedEventTypes}
          setSelectedEventTypes={setSelectedEventTypes}
        />
      </Offcanvas.Body>
    </Offcanvas>
  </div>
  
);

};

export default Events;
