import React, { useEffect, useState } from "react";
import { getFavouriteGames } from "../../api/boardgameApi.js";
import { removeFavouriteGame } from "../../api/profileApi.js";
import AlertMessage from "../AlertMessages.jsx";
import { Card, Spinner, Badge, Button } from "react-bootstrap";
import { FaStar, FaUsers, FaCalendarAlt, FaTags, FaTrash } from "react-icons/fa";
import BoardGameModal from "../BoardGameModal.jsx";
import ConfirmModal from "../../components/Modals/ConfirmationModal.jsx";
import { useNotifications } from "../NotificationsHandling/NotificationContext.jsx";

function FavouriteGames() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [gameToRemove, setGameToRemove] = useState(null);

  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const result = await getFavouriteGames();
        if (result.success) {
          const safeData = result.favorites.map((game) => ({
            ...game,
            categories: Array.isArray(game.categories) ? game.categories : [],
          }));
          setFavourites(safeData);
        } else {
          addNotification({message:"Failed to retrieve favourite games: ", variant:'danger'});
        }
      } catch (err) {
        addNotification({message:"Failed to retrieve favourite games: ", variant:'danger'});
      }
      setLoading(false);
    };

    fetchFavourites();
  }, []);

  const handleCardClick = (gameId) => {
    setSelectedGameId(gameId);
    setModalShow(true);
  };

  const handleRemoveClick = (e, game) => {
    e.stopPropagation(); 
    setGameToRemove(game);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (!gameToRemove) return;

    try {
      const result = await removeFavouriteGame(gameToRemove.id);
      if (result.success) {
        setFavourites((prev) => prev.filter((g) => g.id !== gameToRemove.id));
        addNotification({message:"Board game successfully removed from favourites", variant:'success'});
      } else {
        addNotification({message:"Failed to remove game from favourites", variant:'danger'});
      }
    } catch (err) {
      addNotification({message:"Failed to remove game from favourites", variant:'danger'});
    } finally {
      setShowConfirm(false);
      setGameToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirm(false);
    setGameToRemove(null);
  };

  return (
    <div className="mb-4">
      <h2 className="fw-bold text-dark">My Favorite Games</h2>
      <hr className="mb-4" />

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner
            animation="border"
            role="status"
            variant="warning"
            style={{ width: "4rem", height: "4rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : favourites.length > 0 ? (
        <div className="d-flex flex-column gap-5">
          {favourites.map((game, index) => (
            <Card
              key={`${game.name}-${game.yearPublished || "unknown"}-${index}`}
              className="shadow-lg rounded-4 border-0"
              style={{
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #ffffff 0%, rgb(247, 234, 224) 100%)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderLeft: "6px solid #e85d04",
              }}
              onClick={() => handleCardClick(game.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(232, 93, 4, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  flex: "0 0 250px",
                  overflow: "hidden",
                  borderRadius: "12px 0 0 12px",
                  position: "relative",
                }}
              >
                <Card.Img
                  src={game.imageUrl}
                  alt={game.name}
                  style={{ height: "100%", objectFit: "cover", minHeight: "200px" }}
                />
              </div>

              <Card.Body
                style={{
                  flex: 1,
                  padding: "1.8rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  color: "#1a1a1a",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "#e85d04",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 3px 12px rgba(232, 93, 4, 0.6)",
                  }}
                  title="BGG Score"
                >
                  <FaStar />
                  {game.bggScore !== undefined && game.bggScore !== null
                    ? game.bggScore.toFixed(1)
                    : "N/A"}
                </div>

                <Card.Title
                  className="mb-2 fw-bold"
                  style={{ fontSize: "1.6rem", color: "#e85d04" }}
                >
                  {game.name}
                </Card.Title>

                <Card.Text style={{ fontSize: "1rem", lineHeight: "1.5", color: "#333" }}>
                  {game.description && game.description.length > 250
                    ? game.description.slice(0, 250) + "..."
                    : game.description || "No description."}
                </Card.Text>

                <div className="mb-3 d-flex flex-wrap gap-2">
                  {(game.categories || []).map((c, i) => (
                    <Badge key={`${game.name}-category-${c.name}-${i}`} bg="warning" className="me-2">
                      <FaTags className="me-1" /> {c.name}
                    </Badge>
                  ))}
                </div>

                <ul className="list-unstyled small mb-3" style={{ fontSize: "0.9rem", color: "#555" }}>
                  <li>
                    <FaCalendarAlt className="me-2" />
                    <strong>Year:</strong> {game.yearPublished || "Unknown"}
                  </li>
                  <li>
                    <FaUsers className="me-2" />
                    <strong>Players:</strong> {game.minPlayers} – {game.maxPlayers}
                  </li>
                </ul>

                <div className="mt-auto d-flex justify-content-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => handleRemoveClick(e, game)}
                    style={{
                      borderRadius: "50px",
                      padding: "0.4rem 1.2rem",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      boxShadow: "0 2px 6px rgba(232, 93, 4, 0.3)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#e85d04";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#dc3545"; 
                    }}
                  >
                    <FaTrash className="me-2" />
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted fs-5 mt-5">No favourite games found.</p>
      )}

      <BoardGameModal show={modalShow} onHide={() => setModalShow(false)} gameId={selectedGameId} />

      <ConfirmModal
        show={showConfirm}
        onHide={cancelRemove}
        onConfirm={confirmRemove}
        title="Confirm Deletion"
        bodyText={
          <>
            Are you sure you want to remove <strong>{gameToRemove?.name}</strong> from your favourites?
          </>
        }
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}

export default FavouriteGames;
