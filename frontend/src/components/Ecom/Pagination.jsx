import React from 'react';
import { useLocation } from 'react-router-dom'; // Assuming you're using React Router for routing

const Pagination = ({ totalPages, handlePaginationClick }) => {
  const location = useLocation(); // React Router hook to get current location
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page')) || 1; // Get current page from URL, default to 1

  const createPageItem = (text, page, disabled = false, active = false) => {
    const key = text === '...' ? `ellipsis-${Math.random()}` : `${text}-${page}`;
    return (
      <li key={key} className={`page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`}>
        <a className="page-link" href="#" onClick={() => !disabled && handlePaginationClick(page)}>
          {text}
        </a>
      </li>
    );
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (totalPages <= 1) {
      paginationItems.push(createPageItem('Prev', currentPage - 1, true, false));
      paginationItems.push(createPageItem('1', 1, false, true));
      paginationItems.push(createPageItem('Next', currentPage + 1, true, false));
    } else {
      paginationItems.push(createPageItem('Prev', currentPage - 1, currentPage === 1));
      paginationItems.push(createPageItem('1', 1, false, currentPage === 1));

      if (currentPage > 3) {
        paginationItems.push(createPageItem('...', null, true));
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        paginationItems.push(createPageItem(i, i, false, i === currentPage));
      }

      if (currentPage < totalPages - 2) {
        paginationItems.push(createPageItem('...', null, true));
      }

      paginationItems.push(createPageItem(totalPages, totalPages, false, currentPage === totalPages));
      paginationItems.push(createPageItem('Next', currentPage + 1, currentPage === totalPages));
    }

    return paginationItems;
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {renderPaginationItems()}
      </ul>
    </nav>
  );
};

export default Pagination;



