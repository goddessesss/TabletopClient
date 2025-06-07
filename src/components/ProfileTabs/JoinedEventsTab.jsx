import React from "react";
import { ListGroup, Badge, Button } from "react-bootstrap";
import { FaUsers, FaDice, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function JoinedEventsTab({ events, loading, error }) {
  const navigate = useNavigate();

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
    <div className="mb-4">
      <h2 className="fw-bold text-dark">Joined Events</h2>
      <hr className="mb-4" />

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <span className="ms-2">Loading joined events...</span>
        </div>
      ) : error ? (
        <div className="text-danger text-center mt-4 fs-5">
          Error: {error}
        </div>
      ) : !events || events.length === 0 ? (
        <p className="text-center text-muted mt-4 fs-5">No joined events found.</p>
      ) : (
        <ListGroup variant="flush">
          {events.map((event) => (
            <ListGroup.Item
              key={event.id}
              className="mb-3 p-4 rounded shadow-sm d-flex justify-content-between align-items-center"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fff5ed 100%)",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
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
                <h5
                  className="mb-2 fw-bold text-dark d-flex align-items-center gap-2"
                  style={{ fontSize: "1.35rem" }}
                  title={event.title || event.name}
                >
                  {event.title || event.name}
                  {event.statusName && (
                    <Badge
                      bg={getStatusVariant(event.statusName)}
                      className="d-inline-flex align-items-center gap-1 shadow-sm text-capitalize"
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25em 0.5em",
                        borderRadius: "12px",
                        height: "1.5rem",
                        userSelect: "none",
                      }}
                    >
                      {event.statusName}
                    </Badge>
                  )}
                </h5>

                <p
                  className="mb-3 text-truncate text-secondary"
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    maxWidth: "600px",
                  }}
                  title={event.description}
                >
                  {event.description || "No description available"}
                </p>

                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  {event.boardGameName && (
                    <Badge
                      bg="warning"
                      className="d-inline-flex align-items-center gap-1 shadow-sm"
                      style={{
                        fontSize: "0.9rem",
                        padding: "0.35em 0.75em",
                        borderRadius: "12px",
                        userSelect: "none",
                      }}
                    >
                      <FaDice />
                      {event.boardGameName}
                    </Badge>
                  )}
                </div>

                <div
                  className="mt-2 d-flex flex-wrap gap-4 text-muted"
                  style={{ fontSize: "0.9rem" }}
                >
                  {event.date && (
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendarAlt />
                      <span>
                        <strong>Date:</strong> {formatDate(event.date)}
                      </span>
                    </div>
                  )}
                  {event.participantsCount !== undefined && (
                    <div className="d-flex align-items-center gap-2">
                      <FaUsers />
                      <span>
                        <strong>Participants:</strong> {event.participantsCount}
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
                  style={{ fontWeight: "600" }}
                >
                  <FaCalendarAlt className="me-2" />
                  Details
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default JoinedEventsTab;
