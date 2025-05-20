import React, { Component } from 'react';
import Pagination from '../components/Pagination.jsx';
import { getAllEvents, fetchCityName } from '../api/eventsApi.js';
import {
  Spinner,
  Row,
  Col,
  Button,
  Offcanvas,
  InputGroup,
  Form,
} from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import EventFilter from '../components/Filters/EventFilter.jsx';
import EventList from '../components/Events/EventList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';

function withRouter(Component) {
  return function(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

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
      minAvaliableSlots: 0,
      maxPrice: 0,
      search: '',
      sorting: { participantsCount: null, price: null, startDate: null },
      showFilterSidebar: false,

      cityNamesByEventId: {},
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
      prevState.minAvaliableSlots !== this.state.minAvaliableSlots ||
      prevState.maxPrice !== this.state.maxPrice ||
      JSON.stringify(prevState.sorting) !== JSON.stringify(this.state.sorting) ||
      prevState.minDate !== this.state.minDate ||
      prevState.maxDate !== this.state.maxDate ||
      JSON.stringify(prevState.selectedEventTypes) !== JSON.stringify(this.state.selectedEventTypes);

    const pageChanged = prevState.currentPage !== this.state.currentPage;

    if (filterChanged) {
      if (this.state.currentPage !== 1) {
        this.setState({ currentPage: 1 });
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
        minAvaliableSlots,
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
        minAvaliableSlots: minAvaliableSlots ?? 0,
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

        const cityNamesByEventId = {};
        await Promise.all(
          data.events.map(async (event) => {
            if (event.location?.latitude && event.location?.longitude) {
              const cityName = await this.fetchCityName(
                event.location.latitude,
                event.location.longitude
              );
              cityNamesByEventId[event.id] = cityName;
            } else {
              cityNamesByEventId[event.id] = 'No location';
            }
          })
        );

        this.setState({ cityNamesByEventId });
      } else {
        this.setState({
          events: [],
          totalPages: 1,
          cityNamesByEventId: {},
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      this.setState({
        events: [],
        totalPages: 1,
        cityNamesByEventId: {},
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchCityName = async (latitude, longitude) => {
    try {
      return await fetchCityName(latitude, longitude);
    } catch {
      return 'Unknown city';
    }
  };

  handleEventClick = (id) => {
    this.props.navigate(`/event/${id}`);
  };

  render() {
    const {
      events,
      currentPage,
      totalPages,
      loading,
      search,
      isOnlineFilter,
      selectedCity,
      minAvaliableSlots,
      maxPrice,
      sorting,
      minDate,
      maxDate,
      selectedEventTypes,
      showFilterSidebar,
      cityNamesByEventId,
    } = this.state;

    return (
      <div className="events-wrapper py-4 d-flex justify-content-center">
        <div className="events-container">
          <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search events"
                value={search}
                onChange={(e) => this.setState({ search: e.target.value })}
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
                  minAvaliableSlots={minAvaliableSlots}
                  setMinAvailableSlots={(val) => this.setState({ minAvaliableSlots: val })}
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
              <div className="d-none d-md-block">
                <SearchBar
                  value={search}
                  onChange={(val) => this.setState({ search: val })}
                />
              </div>

              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-center fs-5">🔍 No results found</p>
              ) : (
                <EventList
                  events={events}
                  cityNamesByEventId={cityNamesByEventId}
                  onEventClick={this.handleEventClick}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => this.setState({ currentPage: page })}
              />
            </div>
          </div>

          <Offcanvas
            show={showFilterSidebar}
            onHide={() => this.setState({ showFilterSidebar: false })}
            placement="end"
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
                minAvaliableSlots={minAvaliableSlots}
                setMinAvailableSlots={(val) => this.setState({ minAvaliableSlots: val })}
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

export default withRouter(Events);
