import React, { Component } from 'react';
import CustomPagination from '../components/Pagination.jsx';
import { getAllEvents } from '../api/eventsApi.js';
import {
  Badge,
  Spinner,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  Form,
  Offcanvas,
} from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaWifi,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import EventFilter from '../components/Filters/EventFilter.jsx';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      pageSize: 6,

      selectedEventTypes: [],
      minDate: null,
      maxDate: null,
      isOnlineFilter: null,
      selectedCity: null,
      minAvailableSlots: 0,
      maxPrice: 0,
      search: '',
      sorting: { participantsCount: null, price: null, startDate: null },
      showFilterSidebar: false,
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    const filterChanged =
      prevState.search !== this.state.search ||
      prevState.isOnlineFilter !== this.state.isOnlineFilter ||
      prevState.selectedCity !== this.state.selectedCity ||
      prevState.minAvailableSlots !== this.state.minAvailableSlots ||
      prevState.maxPrice !== this.state.maxPrice ||
      JSON.stringify(prevState.sorting) !== JSON.stringify(this.state.sorting) ||
      prevState.minDate !== this.state.minDate ||
      prevState.maxDate !== this.state.maxDate ||
      JSON.stringify(prevState.selectedEventTypes) !== JSON.stringify(this.state.selectedEventTypes);

    const pageChanged = prevState.currentPage !== this.state.currentPage;

    if (filterChanged) {
      if (this.state.currentPage !== 1) {
        this.setState({ currentPage: 1 });
        return;
      } else {
        this.fetchEvents();
      }
    } else if (pageChanged) {
      this.fetchEvents();
    }
  }

  fetchEvents = async () => {
    this.setState({ loading: true });
    try {
      const {
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
      } = this.state;

      const minDateISO = minDate instanceof Date ? minDate.toISOString() : null;
      const maxDateISO = maxDate instanceof Date ? maxDate.toISOString() : null;

      const queryFilters = {
        isOnline: isOnlineFilter === null ? [] : [isOnlineFilter],
        latitude: selectedCity?.latitude ?? null,
        longitude: selectedCity?.longitude ?? null,
        minAvailableSlots: minAvailableSlots ?? 0,
        maxPrice: maxPrice ?? 0,
        minDate: minDateISO,
        maxDate: maxDateISO,
        eventTypes: selectedEventTypes,
      };

      const data = await getAllEvents(currentPage, pageSize, search, queryFilters, sorting);

      if (data && data.events) {
        this.setState({
          events: data.events,
          totalPages: Math.ceil(data.totalCount / pageSize),
        });
      } else {
        this.setState({
          events: [],
          totalPages: 1,
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке событий:', error);
      this.setState({
        events: [],
        totalPages: 1,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleEventClick = (id) => {
    console.log('Клик по событию с id:', id);
  };

  render() {
    const {
      events,
      currentPage,
      totalPages,
      loading,
      pageSize,
      selectedEventTypes,
      minDate,
      maxDate,
      isOnlineFilter,
      selectedCity,
      minAvailableSlots,
      maxPrice,
      search,
      sorting,
      showFilterSidebar,
    } = this.state;

    return (
      <div className="events-wrapper py-4 d-flex justify-content-center">
        <div className="events-container">
          <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
            <InputGroup style={{ flex: 1, marginRight: '0.5rem' }}>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search events"
                value={search}
                onChange={(e) => this.setState({ search: e.target.value })}
                style={{ borderLeft: 'none', borderRadius: '0.375rem 0 0 0.375rem' }}
              />
            </InputGroup>
            <Button
              variant="warning"
              className="d-flex align-items-center gap-2"
              onClick={() => this.setState({ showFilterSidebar: true })}
            >
              <FaFilter />
            </Button>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-3 d-none d-md-block">
              <div className="event-filter">
                <EventFilter
                  isOnlineFilter={isOnlineFilter}
                  setIsOnlineFilter={(val) => this.setState({ isOnlineFilter: val })}
                  selectedCity={selectedCity}
                  setSelectedCity={(val) => this.setState({ selectedCity: val })}
                  minAvailableSlots={minAvailableSlots}
                  setMinAvailableSlots={(val) => this.setState({ minAvailableSlots: val })}
                  maxPrice={maxPrice}
                  setMaxPrice={(val) => this.setState({ maxPrice: val })}
                  sorting={sorting}
                  setSorting={(val) => this.setState({ sorting: val })}
                  minDate={minDate}
                  setMinDate={(val) => this.setState({ minDate: val })}
                  maxDate={maxDate}
                  setMaxDate={(val) => this.setState({ maxDate: val })}
                  selectedEventTypes={selectedEventTypes}
                  setSelectedEventTypes={(val) => this.setState({ selectedEventTypes: val })}
                />
              </div>
            </div>

            <div className="col-md-7">
              <div className="d-none d-md-block mb-3">
                <InputGroup className="shadow-sm" style={{ borderRadius: '1rem' }}>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search events"
                    value={search}
                    onChange={(e) => this.setState({ search: e.target.value })}
                    style={{ borderLeft: 'none', borderRadius: '0 1rem 1rem 0' }}
                  />
                </InputGroup>
              </div>

              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-center fs-5">No events found.</p>
              ) : (
                <Row key={currentPage} className="g-4">
                  {events.map((event) => (
                    <Col key={event.id} xs={12} md={6}>
                      <Card
                        className="card-event shadow-sm h-100 border-0"
                        onClick={() => this.handleEventClick(event.id)}
                        style={{ cursor: 'pointer', borderRadius: '1rem' }}
                      >
                        <Card.Body className="d-flex flex-column">
                          <div className="mb-3">
                            <Card.Title className="mb-2 fs-5 text-truncate">{event.name}</Card.Title>
                            <div className="text-muted small d-flex align-items-center">
                              <FaCalendarAlt className="me-2" />
                              {new Date(event.startDate).toLocaleString()}
                            </div>
                          </div>

                          <div className="mb-3 d-flex flex-wrap gap-2">
                            <Badge bg={event.isOnline ? 'success' : 'secondary'}>
                              {event.isOnline ? (
                                <>
                                  <FaWifi className="me-1" /> Online
                                </>
                              ) : (
                                <>
                                  <FaMapMarkerAlt className="me-1" /> Offline
                                </>
                              )}
                            </Badge>
                            <Badge bg="info">{event.eventTypeName}</Badge>
                            <Badge bg="light" text="dark" className="d-flex align-items-center">
                              <FaUsers className="me-1" />
                              {event.registeredPlayer
                                ? `${event.registeredPlayer}/${event.maxPlayers}`
                                : `0/${event.maxPlayers}`}
                            </Badge>
                          </div>

                          <div className="mt-auto text-end">
                            <Button
                              variant="primary"
                              className="rounded-pill px-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.handleEventClick(event.id);
                              }}
                            >
                              Join
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              <div className="d-flex justify-content-center mt-5">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => this.setState({ currentPage: page })}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </div>

          <Offcanvas
            show={showFilterSidebar}
            onHide={() => this.setState({ showFilterSidebar: false })}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filters</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <EventFilter
                isOnlineFilter={isOnlineFilter}
                setIsOnlineFilter={(val) => this.setState({ isOnlineFilter: val })}
                selectedCity={selectedCity}
                setSelectedCity={(val) => this.setState({ selectedCity: val })}
                minAvailableSlots={minAvailableSlots}
                setMinAvailableSlots={(val) => this.setState({ minAvailableSlots: val })}
                maxPrice={maxPrice}
                setMaxPrice={(val) => this.setState({ maxPrice: val })}
                sorting={sorting}
                setSorting={(val) => this.setState({ sorting: val })}
                minDate={minDate}
                setMinDate={(val) => this.setState({ minDate: val })}
                maxDate={maxDate}
                setMaxDate={(val) => this.setState({ maxDate: val })}
                selectedEventTypes={selectedEventTypes}
                setSelectedEventTypes={(val) => this.setState({ selectedEventTypes: val })}
              />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    );
  }
}

export default Events;
