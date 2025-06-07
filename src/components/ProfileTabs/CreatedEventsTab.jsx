import React, { useEffect, useState } from "react";
import { Button, ListGroup, Badge } from "react-bootstrap";
import UpdateEventModal from "../Modals/UpdateEventModal.jsx";
import ConfirmModal from "../Modals/ConfirmationModal.jsx";
import { getEventById, updateEvents, getParticipants } from "../../api/eventsApi.js";
import {
  FaEdit,
  FaTrashAlt,
  FaTimesCircle,
  FaUsers,
  FaDice,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CreatedEventsTab({ loading, events = [], onDelete, onUpdate, onCancel }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [participantsMap, setParticipantsMap] = useState({});
  const [localEvents, setLocalEvents] = useState(events);
  const [deleting, setDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    event: null,
    action: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  useEffect(() => {
    if (!localEvents.length) return;

    const fetchParticipantsForEvents = async () => {
      try {
        const promises = localEvents.map((event) =>
          getParticipants(event.id).then((result) =>
            result.success ? result.data : []
          )
        );
        const results = await Promise.all(promises);

        const newParticipantsMap = {};
        localEvents.forEach((event, index) => {
          newParticipantsMap[event.id] = results[index];
        });
        setParticipantsMap(newParticipantsMap);
      } catch (err) {
        setParticipantsMap({});
        console.error("Error fetching participants:", err);
      }
    };

    fetchParticipantsForEvents();
  }, [localEvents]);

  const handleOpenEditModal = async (event) => {
    if (loadingEvent) return;
    setLoadingEvent(true);
    try {
      const response = await getEventById(event.id);
      if (response?.data) {
        setEventToEdit(response.data);
        setShowEditModal(true);
      } else {
        alert("Failed to load event data.");
      }
    } catch (error) {
      console.error("Error fetching event by id:", error);
      alert("Error loading event.");
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEventToEdit(null);
  };

  const handleSave = async (updatedData) => {
    if (!eventToEdit) return;
    setSaving(true);
    try {
      await updateEvents(eventToEdit.id, updatedData);
      if (onUpdate) {
        await onUpdate(eventToEdit.id, updatedData);
      }
      handleCloseEditModal();
    } catch (error) {
      alert("Error saving event data.");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmCancel = (event) => {
    if (deleting) return;
    setConfirmModal({ show: true, event, action: "cancel" });
  };

  const confirmDelete = (event) => {
    if (deleting) return;
    setConfirmModal({ show: true, event, action: "delete" });
  };

  const handleConfirmAction = async () => {
    const { event, action } = confirmModal;
    if (!event || !action || deleting) return;

    setDeleting(true);

    try {
      if (action === "cancel") {
        if (onCancel) {
          await onCancel(event.id);
        }
        setLocalEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === event.id ? { ...e, statusName: "canceled" } : e
          )
        );
      } else if (action === "delete") {
        if (onDelete) {
          await onDelete(event.id);
        }
        setLocalEvents((prevEvents) =>
          prevEvents.filter((e) => e.id !== event.id)
        );
      }
    } catch (error) {
      alert(error?.message || "An error occurred.");
      console.error("Action error:", error);
    } finally {
      setDeleting(false);
      setConfirmModal({ show: false, event: null, action: null });
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "canceled":
        return "danger";
      case "active":
        return "success";
      case "completed":
        return "primary";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Created Events</h2>
        <hr className="mb-4" />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <span className="ms-2">Loading events...</span>
        </div>
      ) : localEvents.length === 0 ? (
        <p className="text-center text-muted mt-4 fs-5">No created events.</p>
      ) : (
        <ListGroup variant="flush">
          {localEvents.map((event) => {
            const participants = participantsMap[event.id] || [];
            const hasParticipants = participants.length > 0;
            const statusLower = event.statusName?.toLowerCase();

            return (
              <ListGroup.Item
                key={event.id}
                className="mb-3 p-4 rounded shadow-sm d-flex justify-content-between align-items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, rgb(255, 245, 237) 100%)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/events/${event.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ flex: 1, marginRight: "20px" }}>
                  <h5 className="mb-2 fw-bold text-dark d-flex align-items-center gap-2">
                    {event.title || event.name}
                    {event.statusName && (
                      <Badge
                        bg={getStatusVariant(event.statusName)}
                        className="text-capitalize shadow-sm"
                      >
                        {event.statusName}
                      </Badge>
                    )}
                  </h5>
                  <p
                    className="mb-3 text-truncate text-secondary"
                    title={event.description}
                  >
                    {event.description || "No description available"}
                  </p>

                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    {event.boardGameName && (
                      <Badge
                        bg="warning"
                        className="d-flex align-items-center gap-1 shadow-sm"
                      >
                        <FaDice />
                        {event.boardGameName}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 d-flex flex-wrap gap-4 text-muted">
                    {event.date && (
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt />
                        <span>
                          <strong>Date:</strong> {formatDate(event.date)}
                        </span>
                      </div>
                    )}
                    {event.startDate && (
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt />
                        <span>
                          <strong>Start:</strong> {formatDate(event.startDate)}
                        </span>
                      </div>
                    )}
                    {event.endDate && (
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt />
                        <span>
                          <strong>End:</strong> {formatDate(event.endDate)}
                        </span>
                      </div>
                    )}
                    {hasParticipants && (
                      <div className="d-flex align-items-center gap-2">
                        <FaUsers />
                        <span>
                          <strong>Participants:</strong> {participants.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    minWidth: "120px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                    disabled={deleting || loadingEvent || saving}
                  >
                    <FaCalendarAlt className="me-2" />
                    Details
                  </Button>

                  {statusLower !== "ended" && statusLower !== "canceled" && (
                    <>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleOpenEditModal(event)}
                        disabled={loadingEvent || deleting || saving}
                      >
                        <FaEdit className="me-2" />
                        Edit
                      </Button>

                      {hasParticipants && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => confirmCancel(event)}
                          disabled={deleting || loadingEvent || saving}
                        >
                          <FaTimesCircle className="me-2" />
                          Cancel
                        </Button>
                      )}

                      {!hasParticipants && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(event)}
                          disabled={deleting || loadingEvent || saving}
                        >
                          <FaTrashAlt className="me-2" />
                          Delete
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      {showEditModal && eventToEdit && (
        <UpdateEventModal
          show={showEditModal}
          onClose={handleCloseEditModal}
          event={eventToEdit}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <ConfirmModal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, event: null, action: null })}
        title={
          confirmModal.action === "cancel"
            ? "Cancel Event Confirmation"
            : "Delete Event Confirmation"
        }
        body={
          confirmModal.action === "cancel"
            ? "Are you sure you want to cancel this event? This action cannot be undone."
            : "Are you sure you want to delete this event? This action cannot be undone."
        }
        onConfirm={handleConfirmAction}
        confirmButtonText={
          confirmModal.action === "cancel" ? "Cancel Event" : "Delete Event"
        }
        isProcessing={deleting}
      />
    </>
  );
}

export default CreatedEventsTab;
