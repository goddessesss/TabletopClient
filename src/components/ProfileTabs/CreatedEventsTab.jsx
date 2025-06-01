import React, { useState, useEffect } from "react";
import { Button, ListGroup, Badge } from "react-bootstrap";
import UpdateEventModal from "../Modals/UpdateEventModal.jsx";
import {
  getEventById,
  updateEvents,
  getParticipants,
  cancelEvent,
  deleteEventById,
} from "../../api/eventsApi.js";

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

  const navigate = useNavigate();

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  useEffect(() => {
    if (!localEvents.length) return;

    const fetchParticipantsForEvents = async () => {
      try {
        const promises = localEvents.map((event) =>
          getParticipants(event.id)
            .then((result) => (result.success ? result.data : []))
            .catch(() => [])
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

  const handleCancelClick = async (event) => {
    if (window.confirm("Are you sure you want to cancel this event?")) {
      try {
        await cancelEvent(event.id);
        setLocalEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === event.id ? { ...e, statusName: "Canceled" } : e
          )
        );
        if (onCancel) onCancel(event.id);
      } catch (error) {
        alert("Failed to cancel event.");
        console.error("Cancel error:", error);
      }
    }
  };

  const handleDeleteClick = async (event) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await deleteEventById(event.id);
        setLocalEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
        if (onDelete) onDelete(event.id);
      } catch (error) {
        alert("Failed to delete event.");
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading events...</span>
      </div>
    );
  }

  if (!localEvents.length) {
    return <p className="text-center text-muted mt-4 fs-5">No created events.</p>;
  }

  return (
    <>
      <ListGroup variant="flush" className="mb-4">
        {localEvents.map((event) => {
          const participants = participantsMap[event.id] || [];
          const hasParticipants = participants.length > 0;
          const statusLower = event.statusName?.toLowerCase();

          const eventDate = event.date ? new Date(event.date) : null;
          const formattedDate =
            eventDate && !isNaN(eventDate)
              ? eventDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              : "";

          const startDate = event.startDate ? new Date(event.startDate) : null;
          const formattedStartDate =
            startDate && !isNaN(startDate)
              ? startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              : "";

          const endDate = event.endDate ? new Date(event.endDate) : null;
          const formattedEndDate =
            endDate && !isNaN(endDate)
              ? endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              : "";

          return (
            <ListGroup.Item
              key={event.id}
              className="mb-3 p-4 rounded shadow-sm d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e3e6f0",
                transition: "box-shadow 0.3s ease, transform 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div className="flex-grow-1 me-4">
                <h5
                  className="mb-2 fw-bold text-dark d-flex align-items-center gap-2"
                  style={{ fontSize: "1.35rem" }}
                >
                  {event.title || event.name}
                 
                </h5>
                <p
                  className="mb-3 text-truncate text-secondary"
                  style={{ maxWidth: "600px", fontSize: "1rem", lineHeight: 1.5 }}
                  title={event.description}
                >
                  {event.description || "No description available"}
                </p>

                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  {event.boardGameName && (
                    <Badge
                      bg="info"
                      className="d-flex align-items-center gap-1 shadow-sm"
                      style={{
                        fontSize: "0.9rem",
                        padding: "0.35em 0.75em",
                        borderRadius: "12px",
                      }}
                    >
                      <FaDice />
                      {event.boardGameName}
                    </Badge>
                  )}

                  {event.statusName && (
                    <Badge
                      bg={getStatusVariant(event.statusName)}
                      className="text-capitalize shadow-sm"
                      style={{
                        fontSize: "0.9rem",
                        padding: "0.35em 0.75em",
                        borderRadius: "12px",
                      }}
                    >
                      {event.statusName}
                    </Badge>
                  )}
                </div>

                <div
                  className="mt-2 d-flex flex-wrap gap-4 text-muted"
                  style={{ fontSize: "0.9rem" }}
                >
                  {formattedDate && (
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendarAlt />
                      <span>
                        <strong>Date:</strong> {formattedDate}
                      </span>
                    </div>
                  )}
                  {formattedStartDate && (
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendarAlt />
                      <span>
                        <strong>Start:</strong> {formattedStartDate}
                      </span>
                    </div>
                  )}
                  {formattedEndDate && (
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendarAlt />
                      <span>
                        <strong>End:</strong> {formattedEndDate}
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

              <div className="d-flex flex-column flex-sm-row gap-3 align-items-center">
                {statusLower !== "canceled" && (
                  <>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate(`/events/${event.id}`)}
                      style={{ minWidth: "110px", fontWeight: "600", borderRadius: "8px" }}
                      title="Details"
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaCalendarAlt />
                      Details
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleOpenEditModal(event)}
                      style={{ minWidth: "110px", fontWeight: "600", borderRadius: "8px" }}
                      title="Edit Event"
                      disabled={loadingEvent}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaEdit />
                      Edit
                    </Button>
                  </>
                )}

                {hasParticipants && statusLower !== "canceled" ? (
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => handleCancelClick(event)}
                    style={{ minWidth: "110px", fontWeight: "600", borderRadius: "8px" }}
                    title="Cancel Event"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaTimesCircle />
                    Cancel
                  </Button>
                ) : null}

                {!hasParticipants && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(event)}
                    style={{ minWidth: "110px", fontWeight: "600", borderRadius: "8px" }}
                    title="Delete Event"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaTrashAlt />
                    Delete
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <UpdateEventModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        event={eventToEdit}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}

export default CreatedEventsTab;
