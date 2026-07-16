"use client";

import React from "react";
import Card from "./Card";
import Loading from "./Loading";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import Input from "./Input";
import { MagnifyingGlass } from "@phosphor-icons/react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Tìm kiếm...",
  searchKey,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Hiện tại không có mục nào trong danh sách này.",
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter data based on search key and query
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim() || !searchKey) return data;

    const query = searchQuery.toLowerCase().trim();

    return data.filter((row) => {
      let value = "";
      if (typeof searchKey === "function") {
        value = searchKey(row);
      } else if (searchKey) {
        value = String(row[searchKey] || "");
      }
      return value.toLowerCase().includes(query);
    });
  }, [data, searchQuery, searchKey]);

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-4 w-full">
      {/* Top Search Action Bar */}
      {searchKey && (
        <div className="flex items-center justify-between gap-4 max-w-xs">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlass size={16} />}
            className="rounded-xl"
          />
        </div>
      )}

      {/* Main Table Content Container (Double Bezel Layout) */}
      <Card variant="double-bezel" className="p-0 border-none" innerClassName="p-0 border-none overflow-hidden space-y-0">
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="py-20">
              <Loading size="lg" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-12">
              <EmptyState title={emptyTitle} description={emptyDescription} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border/80 text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  {columns.map((col, idx) => (
                    <th key={idx} className={`px-6 py-4 select-none ${col.className || ""}`}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-foreground">
                {paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-6 py-4.5 ${col.className || ""}`}>
                        {col.render
                          ? col.render(row)
                          : col.accessorKey
                          ? String(row[col.accessorKey] || "")
                          : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Pagination controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
