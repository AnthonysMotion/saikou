import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ currentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link to={`/anime-list?page=${currentPage - 1}`} className="prev-page">
          Previous
        </Link>
      )}
      <span>Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Link to={`/anime-list?page=${currentPage + 1}`} className="next-page">
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;
