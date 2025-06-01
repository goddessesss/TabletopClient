import React, { useState, useEffect } from 'react';
import { deleteBoardGame, getAllBoardGames } from '../../../api/boardgameApi.js';
import Pagination from '../../Pagination.jsx';
import SearchBar from '../../SearchBar.jsx';
import { useTranslation } from 'react-i18next';
import CreateUpdateBoardGameModal from './CreateUpdateBoardGameModal.jsx';
import { Button } from 'react-bootstrap';
import { useNotifications } from '../../NotificationsHandling/NotificationContext.jsx';

function BoardGamesTab() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const [boardGames, setBoardGames] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this game?');
    if (!confirmed) return;

    const success = await deleteBoardGame(id);

    if (success) {
      setBoardGames(prev => prev.filter(game => game.id !== id));
      addNotification({message: "Game was successfully deleted", variant: 'success'});
    } else {
      addNotification({message: "Failed to delete game", variant: 'danger' });
    }
  };

  return (
    <div>
      <div className="boardgames-container">
          <Button variant="primary" style={{ minWidth: '200px', marginBottom: '10px' }} onClick={() => setShowModal(true)}>Modify Board Games</Button>
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder={t('search.boardGamesPlaceholder')} />
          <div className="item-list">
            {boardGames.length === 0 ? (
              <p>No board games found.</p>
            ) : (
              boardGames.map((game) => (
                <div className="item-card" key={game.id}>
                  <div className="item-name">{game.name}</div>
                  <div className="item-actions">
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
      <CreateUpdateBoardGameModal show={showModal} onHide={() => setShowModal(false)}/>
    </div>
  );
}

export default BoardGamesTab;
