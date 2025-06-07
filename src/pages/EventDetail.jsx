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
import { getEventById, joinEvents, getParticipants, unjoinEvents, updateEvents } from '../api/eventsApi.js';
import { useAuth } from "../components/Context/AuthContext";
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../components/NotificationsHandling/NotificationContext.jsx';
import EventPlayerCard from '../components/PlayerCard/EventPlayerCard.jsx';
import { downloadEventParticipantsReport } from '../api/reportsApi.js';
import UpdateEventModal from '../components/Modals/UpdateEventModal.jsx';

function EventDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userId } = useAuth();

  const { addNotification } = useNotifications()

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isJoined, setJoined] = useState(false);
  const [isOrganizer, setOrganizer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchEvent = async () => {
    const result = await getEventById(id);
    if (result.success) {
      console.log(result.data)
      setEvent(result.data);
      if (result.data.organizerPlayer.playerProfileId === userId){
        setOrganizer(true);
      }

      const participantResult = await getParticipants(id);
      if (participantResult.success) {
        setParticipants(participantResult.data);
        console.log(userId)
        console.log(participantResult.data)
        if (participantResult.data.some(p => p.playerProfileId === userId)) {
          setJoined(true)
        }
        else {
          setJoined(false)
        }
      } else {
        setParticipants([]);
      }
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    if (id && userId) fetchEvent();
  }, [id, userId]);

  const addMessage = (type, text) => {
    addNotification({message: text, variant: type});
  };

  const handleJoin = async () => {
    console.log(userId)
    if (!userId) {
      addMessage('danger', t('eventDetail.userNotAuthorized'));
      return;
    }

    setLoading(true);
    const result = isJoined ? await unjoinEvents(id, userId) : await joinEvents(id, userId);
    if (result.success) {
      addMessage('success', t('eventDetail.successfullyRegistered'));
      await fetchEvent();
    } else {
      addMessage('danger', result.message || t('eventDetail.failedToRegister'));
    }
    setLoading(false);
  };

    const handleGetParticipantsReport = async() => {
    await downloadEventParticipantsReport(event.id)
  }
  
  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    fetchEvent();
  };

  const handleSave = async (updatedData) => {
    if (!event) return;
    setSaving(true);
    try {
      var result = await updateEvents(event.id, updatedData);
      if (result.success)
      {
        addMessage('success', 'Event successfully updated');
        handleCloseEditModal();
      }
    } catch (error) {
      addMessage('danger', 'An error occured during event updating');
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

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
/*


  if (error) return <p className="text-danger">{t('eventDetail.error')}: {error}</p>;
  if (!event)
    return (
      <>
        <p className="text-center my-5" style={{ fontSize: '1.2rem', color: '#666' }}>
          {t('eventDetail.loadingEventDetails')}
        </p>
<<<<<<< HEAD
        <p className="text-center" style={{ color: '#999' }}>
          <strong>{t('eventDetail.urlId')}:</strong> {id || t('eventDetail.notProvided')}
        </p>
=======
>>>>>>> main
      </>
    );

*/
  return (
    <div className="container my-2" style={{ position: 'relative', minHeight:'87vh' }}>
    
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
                      {(price !== null && price !== 0) ? `${price} ₴` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  disabled={loading}
                  onClick={handleJoin}
                  size="lg"
                  variant={`${ !isJoined ? "" : "outline-"}warning`}
                  className="flex-grow-1">
                  { !isJoined ? "Join Event" : "Leave Event" }
                </Button>
                { isOrganizer && ( <><Button
                  disabled={loading}
                  onClick={handleOpenEditModal}
                  size="lg"
                  variant="primary"
                  className="flex-grow-1">
                  Edit details
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleGetParticipantsReport}
                  size="lg"
                  variant="secondary"
                  className="flex-grow-1">
                  Participants report
                </Button> </> ) }
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
                Organizer
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <EventPlayerCard key={event.organizerPlayer.id} player={event.organizerPlayer} />
              </ul>


              <h3 style={{ marginBottom: '1.5rem', fontWeight: '600', color: '#212529' }}>
                Participants ({event.registeredPlayer})
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {participants.map((p, i) => (
                  <EventPlayerCard key={p.id ?? i} player={p} />
                ))}
              </ul>
              {event.externalParticipantsCount != null && event.externalParticipantsCount !== 0 && (<p>+ {event.externalParticipantsCount} external participant(s)</p>)}
            </section>
          </div>
        </Card.Body>
      </div>
        <UpdateEventModal
          show={showEditModal}
          onClose={handleCloseEditModal}
          event={event}
          onSave={handleSave}
          saving={saving}/>
    </div>
  );
}

export default EventDetail;
