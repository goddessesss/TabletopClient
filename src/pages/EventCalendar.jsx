import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import uk from 'date-fns/locale/uk';
import en from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import '../styles/CalendarStyles.scss'
import EventShortDetailsModal from '../components/Events/EventShortDetailsModal';
import { getCalendarEvents } from '../api/eventsApi';

const locales = {
  'uk-UA': uk,
  'en-US': en,
};

const EventCalendar = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: locales[i18n.language] || en }),
    getDay,
    locales,
  });

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {t('calendar.tooltip')}
    </Tooltip>
  );

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const result = await getCalendarEvents();
      if (result.success) {
        const transformed = result.data.map((e) => ({
          id: e.id,
          title: e.name,
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          ...e,
        }));
        setEvents(transformed);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);


  return (
    <div className="container my-2">
      <div className="pt-4">
        <BreadCrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Calendar' },
          ]}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between mb-2 px-2">
        <div class="d-flex align-items-center gap-2">
          <h1 className="fw-bold mb-0">{ t('calendar.title') }</h1>
          <OverlayTrigger placement="right" overlay={renderTooltip}>
            <FaQuestionCircle
              style={{ color: '#ffc107', cursor: 'pointer', fontSize: '16px' }}
            />
          </OverlayTrigger>
        </div>
        
        <Button
          variant="warning"
          onClick={() => navigate('/events/addevent')}
          className="d-none d-md-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Create Event
        </Button>
      </div>
      <div
        className="calendar-container p-4 mb-5 bg-light rounded shadow-sm"
        style={{
          marginTop: '20px',
          maxWidth: 900,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 700,
            width: '100%',
          }}
          culture={i18n.language}
          date={currentDate}
          onNavigate={handleNavigate}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          onSelectEvent={handleSelectEvent}
          views={{
            month: true,
            week: true,
            day: true,
            agenda: true,
          }}
          messages={{
            week: t('calendar.messages.week'),
            work_week: t('calendar.messages.work_week'),
            day: t('calendar.messages.day'),
            month: t('calendar.messages.month'),
            previous: t('calendar.messages.previous'),
            next: t('calendar.messages.next'),
            today: t('calendar.messages.today'),
            agenda: t('calendar.messages.agenda'),
            date: t('calendar.messages.date'),
            time: t('calendar.messages.time'),
            event: t('calendar.messages.event'),
            noEventsInRange: t('calendar.messages.noEventsInRange'),
          }}
        />)}
      </div>
      <EventShortDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default EventCalendar;
