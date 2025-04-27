import React, { useState, useEffect } from 'react';
import CustomPagination from '../components/Pagination.jsx';
import { getAllEvents } from '../api/eventsApi.js';
import BoardGameModal from '../components/BoardGameModal.jsx'; 

const AllBoardGames = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); 

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getAllEvents(currentPage, pageSize);
        if (data && data.boardGames) {
          setEvents(data.boardGames);
          setTotalPages(Math.ceil(data.totalCount / pageSize));
        } else {
          console.error("Data structure is not as expected:", data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleShowModal = (eventId) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEventId(null);
  };

  return (
    <div className="container mt-4">
      <h2>All Boardgames</h2>

      <div>
  <label>Games per page: </label>
  <select
    value={pageSize}
    onChange={handlePageSizeChange}
    className="form-select custom-select"
  >
    <option value={6}>6</option>
    <option value={12}>12</option>
    <option value={18}>18</option>
  </select>
</div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="row">
            {events.map((event, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div
                  className="card"
                  onClick={() => handleShowModal(event.id)} 
                >
                  <img
                    src={event.imageUrl}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description.split(' ').slice(0, 9).join(' ')}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {selectedEventId && (
        <BoardGameModal
          show={showModal}
          onHide={handleCloseModal}
          eventId={selectedEventId}
        />
      )}
    </div>
  );
};

export default AllBoardGames;
