import BoardGameCard from './BoardGameCard';

const BoardGameList = ({ games, onGameClick }) => {
  return (
  <div className="games-grid">
  {games.map((game) => (
    <BoardGameCard key={game.id} game={game} onClick={onGameClick} />
  ))}
</div>

  );
};

export default BoardGameList;
