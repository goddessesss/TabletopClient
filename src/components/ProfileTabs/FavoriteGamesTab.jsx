import React, { useEffect, useState } from "react";
import { getFavoriteBoardGames } from "../../api/boardgameApi.js";
import AlertMessage from "../AlertMessages.jsx";
import { Spinner } from "react-bootstrap";
import BoardGameModal from "../BoardGameModal.jsx";
import BoardGameProfileCard from "../BoardGame/BoardGameProfileCard.jsx";

function FavoriteGamesTab() {
  const [favouriteGames, setFavouriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchFavouriteGames = async () => {
      const result = await getFavoriteBoardGames();
      console.log(result)
      if (result.success) {
        setFavouriteGames(result.data);
      } else {
        setError("Failed to fetch favourite games: " + result.message);
      }
      setLoading(false);
    };

    fetchFavouriteGames();
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
      ) : favouriteGames.length > 0 ? (
        <div className="d-flex flex-column gap-5">
          {favouriteGames.map((game, index) => {
            return (
              <BoardGameProfileCard game={game} index={index} onClick={handleCardClick}></BoardGameProfileCard>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted fs-5 mt-5">No favourite games found.</p>
      )}

      <BoardGameModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        gameId={selectedGameId}
      />
    </div>
  );
}

export default FavoriteGamesTab;
