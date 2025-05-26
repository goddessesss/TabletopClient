import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPaginationItems = () => {
    const items = [];
    const delta = 2;

    if (currentPage - delta > 1) {
      items.push(
        <BootstrapPagination.Item
          key={1}
          onClick={() => onPageChange(1)}
          style={{ color: 'black' }}
        >
          1
        </BootstrapPagination.Item>
      );
      if (currentPage - delta > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      const isActive = i === currentPage;
      items.push(
        <BootstrapPagination.Item
          key={i}
          active={isActive}
          onClick={() => onPageChange(i)}
          disabled={isActive}
          style={
            isActive
              ? { backgroundColor: 'gold', borderColor: 'gold', color: 'black' }
              : { color: 'black' }
          }
        >
          {i}
        </BootstrapPagination.Item>
      );
    }

    if (currentPage + delta < totalPages - 1) {
      if (currentPage + delta < totalPages - 2) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          style={{ color: 'black' }}
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-center mt-4 mb-4">
      <BootstrapPagination>
        <BootstrapPagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <BootstrapPagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {renderPaginationItems()}
        <BootstrapPagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <BootstrapPagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </BootstrapPagination>
    </div>
  );
}

export default Pagination;
