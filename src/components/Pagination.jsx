import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPaginationItems = () => {
    const items = [];
    const delta = 2;

    const activeStyle = {
        backgroundColor: 'gold',
        borderColor: 'gold',
        color: 'black'
    };
    const normalStyle = { color: 'black' };

    const isFirst = currentPage === 1;
    items.push(
      <BootstrapPagination.Item
        key={1}
        active={isFirst}
        disabled={isFirst}
        onClick={() => onPageChange(1)}
        style={isFirst ? activeStyle : normalStyle}
      >
        1
      </BootstrapPagination.Item>
    );

    if (currentPage - delta > 2) {
      items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
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
              ? activeStyle
              : normalStyle
          }
        >
          {i}
        </BootstrapPagination.Item>
      );
    }

    if (currentPage + delta < totalPages - 1) {
      items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
    }

    if (totalPages > 1) {
      const isLast = currentPage === totalPages;
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          active={isLast}
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          style={isLast ? activeStyle : normalStyle}
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
