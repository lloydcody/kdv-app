import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PaginationControls({ currentPage, totalPages, onPrevPage, onNextPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full disabled:opacity-50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <span className="text-white">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full disabled:opacity-50"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}