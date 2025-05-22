import React, { useState } from 'react';
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

const locales = {
  'uk-UA': uk,
  'en-US': en,
};

const EventCalendar = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const navigate = useNavigate();

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: locales[i18n.language] || en }),
    getDay,
    locales,
  });

  const mockEvents = [
    {
      id: 1,
      title: 'Board Game: Settlers of Catan',
      start: new Date('2025-05-25T17:00:00'),
      end: new Date('2025-05-25T20:00:00'),
    },
    {
      id: 2,
      title: 'Mafia (Offline)',
      start: new Date('2025-05-27T19:00:00'),
      end: new Date('2025-05-27T22:00:00'),
    },
    {
      id: 3,
      title: 'D&D Session',
      start: new Date('2025-05-25T12:00:00'),
      end: new Date('2025-05-25T16:00:00'),
    },
  ];

  const handleAddEvent = () => {
    navigate('/addevent');
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {t('calendar.tooltip')}
    </Tooltip>
  );

  return (
    <div className="p-3">
      <div
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '15px 30px',
          borderRadius: '12px',
          width: '100%',
          boxSizing: 'border-box',
          marginTop: '50px',
          maxWidth: 1500,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ flexGrow: 1, minWidth: 250 }}>
          <h3
            className="calendar-label"
            style={{
              margin: 0,
              textAlign: 'left',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {t('calendar.title')}
            <OverlayTrigger placement="right" overlay={renderTooltip}>
              <FaQuestionCircle
                style={{ color: '#ffc107', cursor: 'pointer', fontSize: '16px' }}
              />
            </OverlayTrigger>
          </h3>
          <p style={{ marginTop: 5, color: '#666', fontSize: '0.9rem' }}>
            {t('calendar.description')}
          </p>
        </div>
        <Button variant="warning" onClick={handleAddEvent} style={{ whiteSpace: 'nowrap' }}>
          <FaPlus style={{ marginRight: 8 }} />
          {t('calendar.buttonAddEvent')}
        </Button>
      </div>

      <div
        className="calendar-container p-3 bg-light rounded shadow-sm"
        style={{
          marginTop: '20px',
          maxWidth: 900,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Calendar
          localizer={localizer}
          events={mockEvents}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 600,
            width: '100%',
          }}
          culture={i18n.language}
          date={currentDate}
          onNavigate={handleNavigate}
          view={currentView}
          onView={(view) => setCurrentView(view)}
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
        />
      </div>
    </div>
  );
};

export default EventCalendar;
