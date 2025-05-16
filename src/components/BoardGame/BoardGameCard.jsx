const BoardGameCard = ({ game, onClick }) => {
  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') onClick(game.id);
  };

  return (
    <div
      className="board-game-card"
      onClick={() => onClick(game.id)}
      aria-label={`Open details for ${game.name}`}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      <div className="board-game-card__image-wrapper">
        <img
          src={game.imageUrl || '/no-image.png'}
          alt={game.name}
          className="board-game-card__image"
        />
      </div>

      <div className="board-game-card__content">
        <h5 className="board-game-card__title" title={game.name}>
          {game.name}
        </h5>
        <p
          className="board-game-card__description"
          title={game.description}
        >
          {game.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
};

export default BoardGameCard;
