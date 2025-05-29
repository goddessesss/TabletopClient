import React from "react";

const FavoriteGames = ({ games, loading }) => {
  if (loading) {
    return <p>Loading favorite games...</p>;
  }

  return (
    <div>
      {games.length > 0 ? (
        games.map((game) => (
          <div key={game.id}>
            <h5>{game.name}</h5>
            <p>{game.description}</p>
          </div>
        ))
      ) : (
        <p>You have no favorite games.</p>
      )}
    </div>
  );
};

export default FavoriteGames;
