import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);  // Calculate total pages

  return (
    <div>
      {/* Previous Page Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => window.location.href = `/anime/list/${currentPage - 1}`}
      >
        Previous
      </button>

      {/* Page Number Buttons */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => window.location.href = `/anime/list/${index + 1}`}
          style={{ fontWeight: currentPage === index + 1 ? 'bold' : 'normal' }}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Page Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => window.location.href = `/anime/list/${currentPage + 1}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
