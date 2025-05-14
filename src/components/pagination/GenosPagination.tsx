type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  delta?: number; // jumlah halaman kiri-kanan
  showFirstLast?: boolean; // tampilkan tombol « dan »
};

const GenosPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  delta = 2,
  showFirstLast,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push("...");
    }

    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center gap-1 justify-end mt-4 text-sm">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded border-border-pagination hover:bg-primary-light2 cursor-pointer transition-all duration-300"
        >
          {" "}
          &laquo;
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 border rounded border-border-pagination hover:bg-primary-light2 cursor-pointer transition-all duration-300"
      >
        &lsaquo;
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 border rounded border-border-pagination ${
              currentPage === page
                ? "bg-primary-color text-white font-bold"
                : "hover:bg-primary-light2 cursor-pointer transition-all duration-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 border rounded border-border-pagination hover:bg-primary-light2 cursor-pointer transition-all duration-300"
      >
        &rsaquo;
      </button>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded border-border-pagination hover:bg-primary-light2 cursor-pointer transition-all duration-300"
        >
          &raquo;
        </button>
      )}
    </div>
  );
};

export default GenosPagination;
