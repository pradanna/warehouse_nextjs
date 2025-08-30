// GenosTableLocal.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import GenosPagination from "../pagination/GenosPagination";
import GenosCheckbox from "../form/GenosCheckbox";
import GenosButton from "../button/GenosButton";
import { formatRupiah } from "@/lib/helper";

type TableHead = {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "currency" | "number" | string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | string;
};

type ActionType = {
  view?: (row: any) => void;
  edit?: (row: any) => void;
  delete?: (row: any) => void;
  collapse?: boolean | ((row: any) => React.ReactNode);
};

type GenosTableLocalProps = {
  TABLE_HEAD: TableHead[];
  TABLE_ROWS: any[];
  CHECKBOXS?: boolean;
  rowsPerPage?: number;
  SORT?: boolean;
  PAGINATION?: boolean;
  ACTION_BUTTON?: ActionType;
};

export default function GenosTableLocal({
  TABLE_HEAD,
  TABLE_ROWS,
  CHECKBOXS = false,
  rowsPerPage = 10,
  SORT = true,
  PAGINATION = true,
  ACTION_BUTTON,
}: GenosTableLocalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 🔍 filter
  const filteredRows = useMemo(() => {
    if (!searchQuery) return TABLE_ROWS;
    const q = searchQuery.toLowerCase();
    return TABLE_ROWS.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, TABLE_ROWS]);

  // ↕️ sort
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === undefined || bVal === undefined) return 0;

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredRows, sortKey, sortOrder]);

  // 📄 pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = PAGINATION
    ? sortedRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : sortedRows;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full">
      {/* 🔍 Input Pencarian */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari data..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset ke page 1 saat search
          }}
          className="border px-3 py-2 rounded-md w-1/3"
        />
      </div>

      {/* 📊 Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {TABLE_HEAD.map((head) => (
                <th
                  key={head.key}
                  className={clsx(
                    "p-2 text-left font-semibold",
                    head.sortable && "cursor-pointer"
                  )}
                  onClick={() => SORT && head.sortable && handleSort(head.key)}
                >
                  <div className="flex items-center gap-1">
                    {head.label}
                    {SORT &&
                      head.sortable &&
                      sortKey === head.key &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-3 h-3 text-primary-color" />
                      ) : (
                        <ChevronDownIcon className="w-3 h-3 text-primary-color" />
                      ))}
                  </div>
                </th>
              ))}
              {ACTION_BUTTON && <th className="p-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length + (ACTION_BUTTON ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={clsx(
                    "border-b hover:bg-gray-50",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                  )}
                >
                  {TABLE_HEAD.map((head) => (
                    <td key={head.key} className="p-2">
                      {head.type === "currency"
                        ? formatRupiah(row[head.key])
                        : row[head.key]}
                    </td>
                  ))}
                  {ACTION_BUTTON && (
                    <td className="p-2 flex gap-2">
                      {ACTION_BUTTON.view && (
                        <button onClick={() => ACTION_BUTTON.view(row)}>
                          <EyeIcon className="w-5 h-5 text-blue-500" />
                        </button>
                      )}
                      {ACTION_BUTTON.edit && (
                        <button onClick={() => ACTION_BUTTON.edit(row)}>
                          <PencilSquareIcon className="w-5 h-5 text-yellow-500" />
                        </button>
                      )}
                      {ACTION_BUTTON.delete && (
                        <button onClick={() => ACTION_BUTTON.delete(row)}>
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {PAGINATION && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <GenosPagination
            delta={2}
            showFirstLast
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
