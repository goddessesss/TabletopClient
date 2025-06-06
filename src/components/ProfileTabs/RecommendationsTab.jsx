import React, { useEffect, useState } from "react";
import { getRecommendations } from "../../api/boardgameApi.js";
import AlertMessage from "../AlertMessages.jsx";
import { Card, Spinner, Badge } from "react-bootstrap";
import { FaStar, FaUsers, FaCalendarAlt, FaTags, FaDice, FaLayerGroup, FaPuzzlePiece } from "react-icons/fa";
import BoardGameModal from "../BoardGameModal.jsx";

function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const result = await getRecommendations();
      if (result.success) {
        const safeData = result.data.map((game) => ({
          ...game,
          boardGame: game.boardGame || {},
          explanation: game.explanation || {},
          boardGameCategories: Array.isArray(game.boardGame?.categories)
            ? game.boardGame.categories
            : [],
        }));
        setRecommendations(safeData);
      } else {
        setError("Failed to fetch recommendations: " + result.message);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  const handleCardClick = (gameId) => {
    setSelectedGameId(gameId);
    setModalShow(true);
  };

  return (
    <div>
       <div className="mb-4">
        <h2 className="fw-bold text-dark">Recommendations</h2>
        <hr className="mb-4" />
      </div>

      {error && (
        <AlertMessage variant="danger" message={error} onClose={() => setError(null)} />
      )}

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
      ) : recommendations.length > 0 ? (
        <div className="d-flex flex-column gap-5">
          {recommendations.map((game, index) => {
            const bg = game.boardGame;
            const similarity = game.explanation.similarityScore || 0;
            const similarityPercent = Math.round(similarity * 100);

            return (
              <div
                className="mb-4"
                key={`${bg.name}-${bg.yearPublished || "unknown"}-${index}`}
              >
                <Card
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
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleCardClick(bg.id)}
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
                      src={bg.imageUrl}
                      alt={bg.name}
                      style={{ height: "100%", objectFit: "cover", minHeight: "200px" }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                        borderTop: "70px solid rgba(255, 223, 0, 0.95)",
                        borderRight: "70px solid transparent",
                        borderTopLeftRadius: "12px",
                        pointerEvents: "none",
                        zIndex: 2,
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: 30,
                        left: 0,
                        width: "50px",
                        color: "#000",
                        fontWeight: "700",
                        fontSize: "0.9rem",
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                        transform: "rotate(-45deg)",
                        transformOrigin: "left top",
                        pointerEvents: "none",
                        zIndex: 3,
                        userSelect: "none",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {similarityPercent}%
                    </div>
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
                      {bg.bggScore !== undefined && bg.bggScore !== null
                        ? bg.bggScore.toFixed(1)
                        : "N/A"}
                    </div>

                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                      <Card.Title
                        className="mb-0 fw-bold"
                        style={{ fontSize: "1.6rem", color: "#e85d04" }}
                      >
                        {bg.name}
                      </Card.Title>
                    </div>

                    <Card.Text
                      style={{ fontSize: "1rem", lineHeight: "1.5", color: "#333" }}
                    >
                      {bg.description && bg.description.length > 250
                        ? bg.description.slice(0, 250) + "..."
                        : bg.description || "No description."}
                    </Card.Text>

                    <div className="mb-3 d-flex flex-wrap gap-2">
                      {(bg.categories || []).map((c, i) => (
                        <Badge
                          key={`${bg.name}-category-${c.name}-${i}`}
                          bg="warning"
                          className="me-2"
                        >
                          <FaTags className="me-1" /> {c.name}
                        </Badge>
                      ))}
                    </div>

                    <ul
                      className="list-unstyled small mb-3"
                      style={{ fontSize: "0.9rem", color: "#555" }}
                    >
                      <li>
                        <FaCalendarAlt className="me-2" />
                        <strong>Year:</strong> {bg.yearPublished || "Unknown"}
                      </li>
                      <li>
                        <FaUsers className="me-2" />
                        <strong>Players:</strong> {bg.minPlayers} – {bg.maxPlayers}
                      </li>
                    </ul>

                    {game.explanation && (
                      <div style={{ fontSize: "0.9rem", color: "#444" }}>
                        <hr />
                        <p>
                          <FaStar className="me-2" />
                          <strong>Similarity Score:</strong> {similarityPercent}%
                        </p>

                        {Array.isArray(game.explanation.sharedCategories) &&
                          game.explanation.sharedCategories.length > 0 && (
                            <p>
                              <FaTags className="me-2" />
                              <strong>Shared Categories:</strong>{" "}
                              {game.explanation.sharedCategories.join(", ")}
                            </p>
                          )}
                        {Array.isArray(game.explanation.sharedMechanics) &&
                          game.explanation.sharedMechanics.length > 0 && (
                            <p>
                              <FaDice className="me-2" />
                              <strong>Shared Mechanics:</strong>{" "}
                              {game.explanation.sharedMechanics.join(", ")}
                            </p>
                          )}
                        {Array.isArray(game.explanation.sharedThemes) &&
                          game.explanation.sharedThemes.length > 0 && (
                            <p>
                              <FaLayerGroup className="me-2" />
                              <strong>Shared Themes:</strong>{" "}
                              {game.explanation.sharedThemes.join(", ")}
                            </p>
                          )}
                        {Array.isArray(game.explanation.sharedSubcategories) &&
                          game.explanation.sharedSubcategories.length > 0 && (
                            <p>
                              <FaPuzzlePiece className="me-2" />
                              <strong>Shared Subcategories:</strong>{" "}
                              {game.explanation.sharedSubcategories.join(", ")}
                            </p>
                          )}

                        <p>
                          <FaUsers className="me-2" />
                          <strong>Shared Family:</strong>{" "}
                          {game.explanation.sharedFamily || "None"}
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted mt-4 fs-5">No recommendations found.</p>
      )}

      <BoardGameModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        gameId={selectedGameId}
      />
    </div>
  );
}

export default RecommendationsTab;
