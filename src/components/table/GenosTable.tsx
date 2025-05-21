// components/GenosTable.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import GenosTextfield from "../form/GenosTextfield";
import GenosPagination from "../pagination/GenosPagination";
import { motion } from "framer-motion";
import GenosCheckbox from "../form/GenosCheckbox";
import GenosButton from "../button/GenosButton";

type TableHead = {
  key: string;
  label: string;
  sortable?: boolean;
};

type ActionType = {
  view?: (row: any) => void;
  edit?: (row: any) => void;
  delete?: (row: any) => void;
};

type GenosTableProps = {
  TABLE_HEAD: TableHead[];
  TABLE_ROWS: any[];
  CHECKBOXS?: boolean;
  SORT?: boolean;
  onAddData?: () => void;
  handleExportSelected?: () => void;
  handleDeleteSelected?: () => void;
  PAGINATION?: boolean;
  FILTER?: React.ReactNode;
  ACTION_BUTTON?: ActionType;
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl";
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (key: string, order: "asc" | "desc") => void;
  totalRows?: number;
  rowsPerPage?: number;
  isBelowStock?: (row: any) => boolean;
  isAboveStock?: (row: any) => boolean;

  loading?: boolean;
  error?: boolean;
};

const fontSizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

export default function GenosTable({
  TABLE_HEAD,
  TABLE_ROWS,
  CHECKBOXS = false,
  rowsPerPage = 10,
  onAddData,
  onPageChange,
  SORT = false,
  PAGINATION = false,
  currentPage,
  totalRows,
  onSortChange,
  FILTER,
  fontSize = "sm",
  ACTION_BUTTON,
  loading,
  error,
  isBelowStock,
  isAboveStock,

  handleDeleteSelected,
  handleExportSelected,
}: GenosTableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const isAllSelected =
    TABLE_ROWS.length > 0 && selectedRows.length === TABLE_ROWS.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(TABLE_ROWS);
    }
  };

  const handleSelectRow = (row: any) => {
    const isSelected = selectedRows.includes(row);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const [stateCurrentPage, setStateCurrentPage] = useState<number>(1);

  const internalCurrentPage = onPageChange
    ? currentPage || 1
    : stateCurrentPage;
  const internalRowsPerPage = rowsPerPage || 10;

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    let newOrder: "asc" | "desc" = "asc";
    if (sortKey === key) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortKey(key);
    setSortOrder(newOrder);

    if (onSortChange) {
      onSortChange(key, newOrder);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setStateCurrentPage(page);
    }
  };

  const sortedRows = sortKey
    ? [...TABLE_ROWS].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        return sortOrder === "asc"
          ? aVal > bVal
            ? 1
            : -1
          : aVal < bVal
          ? 1
          : -1;
      })
    : TABLE_ROWS;

  const paginatedRows =
    PAGINATION && !onPageChange // frontend pagination
      ? sortedRows.slice(
          (internalCurrentPage - 1) * internalRowsPerPage,
          internalCurrentPage * internalRowsPerPage
        )
      : sortedRows; // backend pagination, tidak slice lagi

  const totalPages = Math.ceil(
    (totalRows || sortedRows.length) / internalRowsPerPage
  );

  if (error) {
    return (
      <div className="p-4 text-center text-red-500  min-h-[595px]">
        Error:....
      </div>
    );
  }

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      <div className="flex flex-wrap justify-between">
        {FILTER && <div>{FILTER}</div>}

        <div className="flex gap-2 ">
          {handleDeleteSelected ? (
            <GenosButton
              label={`Hapus (${selectedRows.length})`}
              onClick={handleDeleteSelected}
              iconLeft={<TrashIcon className="w-4 h-4" />}
              disabled={selectedRows.length === 0}
              color="danger"
              size="sm"
              round="md"
              selfStart
              outlined
            />
          ) : (
            <div></div>
          )}

          {handleExportSelected ? (
            <GenosButton
              label="Export"
              onClick={handleExportSelected}
              iconLeft={<ArrowDownTrayIcon className="w-4 h-4" />}
              // disabled={selectedRows.length === 0}
              color="warning"
              size="sm"
              round="md"
              selfStart
              outlined
            />
          ) : (
            <div></div>
          )}

          {onAddData ? (
            <GenosButton
              label="Tambah Data"
              onClick={onAddData}
              iconLeft={<PlusIcon className="w-4 h-4" />}
              disabled={!onAddData}
              color="success"
              size="md"
              round="md"
              selfStart
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div className="overflow-auto min-h-[495px]">
        <div className="w-full">
          {loading ? (
            <div className="p-4 text-center text-gray-500 min-h-[495px]">
              Loading data...
            </div>
          ) : TABLE_ROWS.length === 0 ? (
            <div className="p-4 text-center text-gray-500 min-h-[495px]">
              No data available...!
            </div>
          ) : (
            <table
              className={clsx(
                "w-full table-auto border-collapse transition-all duration-300 ease-in-out",
                fontSizeMap[fontSize]
              )}
            >
              <thead>
                <tr className="border-b border-light2">
                  {CHECKBOXS && (
                    <th className="text-center">
                      <GenosCheckbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head.key}
                      className={clsx(
                        "p-3 text-left font-semibold",
                        head.sortable && "cursor-pointer"
                      )}
                      onClick={() =>
                        SORT && head.sortable && handleSort(head.key)
                      }
                    >
                      <div className="flex items-center gap-1">
                        {head.label}
                        {SORT && head.sortable && (
                          <div className="flex flex-col ml-1 leading-none justify-center items-center transition-all duration-300 ease-in-out">
                            <ChevronUpIcon
                              className={clsx(
                                "w-2 h-2 text-gray-400 transition-all duration-300 ease-in-out",
                                sortKey === head.key &&
                                  sortOrder === "asc" &&
                                  "text-primary-color w-3 h-3"
                              )}
                            />
                            <ChevronDownIcon
                              className={clsx(
                                "w-2 h-2 text-gray-400 transition-all duration-300 ease-in-out",
                                sortKey === head.key &&
                                  sortOrder === "desc" &&
                                  "text-primary-color w-3 h-3"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  {ACTION_BUTTON && <th className="p-3">Action</th>}
                </tr>
              </thead>
              <tbody className="transition-all duration-300 ease-in-out">
                {paginatedRows.map((row, index) => {
                  const below = isBelowStock?.(row);
                  const above = isAboveStock?.(row);

                  return (
                    <tr
                      key={index}
                      className={clsx(
                        "transition-all duration-300 ease-in-out border-b border-light2 hover:bg-light2",
                        selectedRows.includes(row)
                          ? "bg-primary-light3"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-light1",
                        below && "bg-red-100",
                        above && "bg-yellow-100"
                      )}
                    >
                      {CHECKBOXS && (
                        <td className="text-center">
                          <GenosCheckbox
                            checked={selectedRows.includes(row)}
                            onChange={() => handleSelectRow(row)}
                          />
                        </td>
                      )}
                      {TABLE_HEAD.map((head) => (
                        <td key={head.key} className="p-3">
                          {row[head.key]}
                        </td>
                      ))}
                      {ACTION_BUTTON && (
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-4">
                            {ACTION_BUTTON.view && (
                              <button
                                onClick={() => ACTION_BUTTON.view?.(row)}
                                className="text-gray-800 hover:text-success-base cursor-pointer transition-all duration-300"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                            )}
                            {ACTION_BUTTON.edit && (
                              <button
                                onClick={() => ACTION_BUTTON.edit?.(row)}
                                className="text-gray-800 hover:text-warning-base cursor-pointer transition-all duration-300"
                              >
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                            )}
                            {ACTION_BUTTON.delete && (
                              <button
                                onClick={() => ACTION_BUTTON.delete?.(row)}
                                className="text-gray-800 hover:text-danger-base cursor-pointer transition-all duration-300"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {PAGINATION && (
        <GenosPagination
          delta={2}
          showFirstLast
          currentPage={internalCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
