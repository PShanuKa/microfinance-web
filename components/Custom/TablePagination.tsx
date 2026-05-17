import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Logic to show limited pages (max 5 buttons visible)
  let visiblePages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      visiblePages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      visiblePages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      visiblePages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  }

  return (
    <div className="py-5 flex items-center justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }} 
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {visiblePages[0] > 1 && (
             <PaginationItem>
               <PaginationEllipsis />
             </PaginationItem>
          )}

          {visiblePages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === p}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
             <PaginationItem>
               <PaginationEllipsis />
             </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }} 
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
