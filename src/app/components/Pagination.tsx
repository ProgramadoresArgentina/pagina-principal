'use client';

import React, { JSX } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return <></>;
  }

  return (
    <div className="tp-pagination-wrap">
      <div className="row">
        <div className="col-12">
          <div className="tp-pagination text-center">
            <nav>
              <ul>
                {/* Botón Anterior */}
                {currentPage > 1 && (
                  <li>
                    <button 
                      onClick={() => onPageChange(currentPage - 1)}
                      className="tp-pagination-btn"
                      aria-label="Página anterior"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                )}

                {/* Números de página */}
                {getVisiblePages().map((page, index) => (
                  <li key={index}>
                    {page === '...' ? (
                      <span className="tp-pagination-dots">...</span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page as number)}
                        className={`tp-pagination-btn ${currentPage === page ? 'active' : ''}`}
                        aria-label={`Página ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )}
                  </li>
                ))}

                {/* Botón Siguiente */}
                {currentPage < totalPages && (
                  <li>
                    <button 
                      onClick={() => onPageChange(currentPage + 1)}
                      className="tp-pagination-btn"
                      aria-label="Página siguiente"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
