"use client";

import React from "react";
import Button from "./Button";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 py-4 ${className}`}
    >
      <Button
        variant="outline"
        size="xs"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="w-8 h-8 p-0 flex items-center justify-center rounded-lg"
        aria-label="Previous page"
      >
        <CaretLeft size={14} weight="bold" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "primary" : "outline"}
          size="xs"
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 p-0 flex items-center justify-center rounded-lg text-xs font-mono font-bold ${
            p === currentPage ? "" : "hover:bg-muted"
          }`}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="xs"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 p-0 flex items-center justify-center rounded-lg"
        aria-label="Next page"
      >
        <CaretRight size={14} weight="bold" />
      </Button>
    </nav>
  );
};

export default Pagination;
