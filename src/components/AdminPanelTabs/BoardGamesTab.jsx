import React, { useState, useEffect } from 'react';
import { getAllBoardGames } from '../../api/boardgameApi.js';
import Pagination from '../Pagination.jsx';
import SearchBar from '../SearchBar.jsx';

function BoardGamesTab() {
  const [boardGames, setBoardGames] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 15;

  useEffect(() => {
    getAllBoardGames(pageNumber, pageSize, searchTerm, null)
      .then((data) => {
        setBoardGames(data.boardGames || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch(() => {
        setBoardGames([]);
        setTotalCount(0);
      });
  }, [pageNumber, searchTerm]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleUpdate = (id) => {
    alert(`Update board game with id: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete board game with id: ${id}`);
  };

  return (
    <div className="boardgames-container">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <div className="boardgames-list">
        {boardGames.length === 0 ? (
          <p>No board games found.</p>
        ) : (
          boardGames.map((game) => (
            <div className="boardgame-card" key={game.id}>
              <div className="boardgame-name">{game.name}</div>
              <div className="boardgame-actions">
                <button onClick={() => handleUpdate(game.id)} className="btn update-btn">
                  Update
                </button>
                <button onClick={() => handleDelete(game.id)} className="btn delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
    </div>
  );
}

export default BoardGamesTab;
