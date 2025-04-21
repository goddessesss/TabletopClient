import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../api/eventsApi.js';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

function AllBoardGames() {
  const [games, setGames] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 12;
  const MAX_VISIBLE_PAGES = 8;

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllEvents(pageNumber, PAGE_SIZE);
      if (result.success) {
        setGames(result.data.boardGames || []);
        const total = result.data.totalCount || 0;
        setTotalPages(Math.ceil(total / PAGE_SIZE));
      } else {
        console.error(result.message);
      }
    };

    fetchData();
  }, [pageNumber]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    let start = Math.max(1, pageNumber - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    if (start > 1) {
      items.push(
        <BootstrapPagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </BootstrapPagination.Item>
      );
      if (start > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let page = start; page <= end; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === pageNumber}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <BootstrapPagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 9) {
      return words.slice(0, 9).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3 text-dark">Board Games</h2>
      <div className="row">
        {games.length > 0 ? (
          games.map((game, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-lg border-0 rounded-3 overflow-hidden transform-hover">
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body p-4">
                  <h5 className="card-title text-dark">{game.name}</h5>
                  <p className="card-text text-muted">{truncateDescription(game.description || '—')}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">
            <p>No games found.</p>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <BootstrapPagination>
          <BootstrapPagination.First onClick={() => handlePageChange(1)} disabled={pageNumber === 1} />
          <BootstrapPagination.Prev onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1} />
          {renderPaginationItems()}
          <BootstrapPagination.Next onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === totalPages} />
          <BootstrapPagination.Last onClick={() => handlePageChange(totalPages)} disabled={pageNumber === totalPages} />
        </BootstrapPagination>
      </div>
    </div>
  );
}

export default AllBoardGames;
