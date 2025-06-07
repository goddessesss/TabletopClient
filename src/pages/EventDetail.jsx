import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Button, Alert } from 'react-bootstrap';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaGamepad,
  FaMoneyBillWave,
  FaGlobe,
} from 'react-icons/fa';
import { getEventById, joinEvents, getParticipants } from '../api/eventsApi.js';
import { useAuth } from "../components/Context/AuthContext";
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';
import { useTranslation } from 'react-i18next';

function EventDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userId } = useAuth();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvent = async () => {
    const result = await getEventById(id);
    if (result.success) {
      setEvent(result.data);
      const participantResult = await getParticipants(id);
      if (participantResult.success) {
        setParticipants(participantResult.data);
      } else {
        setParticipants([]);
      }
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const addMessage = (type, text) => {
    const messageId = Date.now();
    setMessages((prev) => [...prev, { id: messageId, type, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }, 5000);
  };

  const handleJoin = async () => {
    if (!userId) {
      addMessage('danger', t('eventDetail.userNotAuthorized'));
      return;
    }

    setLoading(true);
    const result = await joinEvents(id, userId);
    if (result.success) {
      addMessage('success', t('eventDetail.successfullyRegistered'));
      await fetchEvent();
    } else {
      addMessage('danger', result.message || t('eventDetail.failedToRegister'));
    }
    setLoading(false);
  };

  if (error) return <p className="text-danger">{t('eventDetail.error')}: {error}</p>;

  if (!event)
    return (
      <>
        <p className="text-center my-5" style={{ fontSize: '1.2rem', color: '#666' }}>
          {t('eventDetail.loadingEventDetails')}
        </p>
        <p className="text-center" style={{ color: '#999' }}>
          <strong>{t('eventDetail.urlId')}:</strong> {id || t('eventDetail.notProvided')}
        </p>
      </>
    );

  const {
    name,
    description,
    maxPlayers,
    minPlayers,
    registeredPlayer,
    startDate,
    endDate,
    isOnline,
    boardGameName,
    eventTypeName,
    price,
    location,
  } = event;

  const formatDate = (dateStr) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container my-2" style={{ position: 'relative', minHeight:'87vh' }}>
      <div
        style={{
          position: 'fixed',
          top: '200px',
          right: '20px',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minWidth: '400px',
        }}
      >
        {messages.map(({ id, type, text }) => (
          <Alert
            key={id}
            variant={type}
            onClose={() =>
              setMessages((prev) => prev.filter((msg) => msg.id !== id))
            }
            dismissible
          >
            {text}
          </Alert>
        ))}
      </div>

      <div className="pt-4">
        <BreadCrumbs
          items={[
            { label: t('events.breadcrumbHome'), path: '/' },
            { label: t('events.pageTitle'), path: '/events' },
            { label: t('eventDetail.eventDetails') },
          ]}
        />
      </div>

      <h1 className="fw-bold mb-2 px-2">{t('eventDetail.eventDetails')}</h1>

      <div className="details-container">
        <Card.Body className="event-card-body">
          <div className="details-grid" style={{ display: 'flex', gap: '2rem' }}>
            <section className="event-info" style={{ flex: 1 }}>
              <div
                className="location-status"
                style={{
                  marginTop: '0.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#d2ab34',
                }}
              >
                {isOnline ? (
                  <>
                    <FaGlobe /> {t('eventDetail.onlineEvent')}
                  </>
                ) : location ? (
                  <>
                    <FaMapMarkerAlt /> {location.fullName || location.shortName || t('eventDetail.unknownLocation')}
                  </>
                ) : (
                  t('eventDetail.locationNotSpecified')
                )}
              </div>

              <header className="event-header" style={{ marginBottom: '1rem' }}>
                <h1 className="event-title">{name}</h1>
                <Badge bg="warning" className="event-badge" style={{ marginLeft: '0.5rem' }}>
                  {eventTypeName}
                </Badge>
              </header>

              <p className="event-description" style={{ marginBottom: '2rem', textAlign: 'justify' }}>
                {description || t('eventDetail.noDescription')}
              </p>

              <div
                className="event-info-items"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaCalendarAlt size={22} className="icon primary" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                      {t('eventDetail.start')}
                    </span>
                    <span className="value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>
                      {formatDate(startDate)}
                    </span>
                  </div>
                </div>

                <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaCalendarAlt size={22} className="icon secondary" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                      {t('eventDetail.end')}
                    </span>
                    <span className="value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>
                      {formatDate(endDate)}
                    </span>
                  </div>
                </div>

                <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaGamepad size={22} className="icon warning" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                      {t('eventDetail.game')}
                    </span>
                    <span className="value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>
                      {boardGameName || t('eventDetail.na')}
                    </span>
                  </div>
                </div>

                <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaUsers size={22} className="icon success" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                      {t('eventDetail.players')}
                    </span>
                    <span className="value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>
                      {registeredPlayer} / {minPlayers} - {maxPlayers}
                    </span>
                  </div>
                </div>

                <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaMoneyBillWave size={22} className="icon danger" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                      {t('eventDetail.price')}
                    </span>
                    <span className="value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>
                      {price ? `${price} ₴` : t('eventDetail.free')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
               <Button
              disabled={loading}
              onClick={handleJoin}
              size="lg"
              variant="outline-warning"
              className="w-100">
              {t('eventDetail.joinEvent')}
            </Button>

              </div>
            </section>

            <section
              className="event-participants"
              style={{
                flex: '0 0 280px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', fontWeight: '600', color: '#212529' }}>
                {t('eventDetail.participants')} ({participants.length})
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {participants.map((p, i) => {
                  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase();
                  return (
                    <li
                      key={p.id ?? i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                        cursor: 'default',
                        userSelect: 'none',
                        transition: 'background-color 0.25s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f4f8')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: '#495057',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '1.25rem',
                          marginRight: '1rem',
                          flexShrink: 0,
                          userSelect: 'none',
                        }}
                      >
                        {initials}
                      </div>
                      <span style={{ fontSize: '1.1rem', color: '#212529' }}>
                        {(p.firstName || '') + ' ' + (p.lastName || '')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </Card.Body>
      </div>
    </div>
  );
}

export default EventDetail;
