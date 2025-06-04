import React, { useEffect, useState } from "react";
import { getRecommendations } from "../../api/boardgameApi.js";
import AlertMessage from "../AlertMessages.jsx";
import { Spinner } from "react-bootstrap";
import BoardGameModal from "../BoardGameModal.jsx";
import BoardGameProfileCard from "../BoardGame/BoardGameProfileCard.jsx";

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
    <div className="p-5" style={{ minHeight: "100vh", width: "100%" }}>
      {error && (
        <AlertMessage variant="danger" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" variant="warning" style={{ width: "4rem", height: "4rem" }}>
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
              <BoardGameProfileCard game={bg} sharedItems={game.explanation} 
                similarityPercent={similarityPercent} index={index} onClick={handleCardClick}></BoardGameProfileCard>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted fs-5 mt-5">No recommendations found.</p>
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
