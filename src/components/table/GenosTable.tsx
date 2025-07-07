// components/GenosTable.tsx
"use client";

import React, { useState } from "react";
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
import { ClipLoader } from "react-spinners";

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
  RIGHT_DIV?: React.ReactNode;
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

const state = {
  neutral: "",
  warning: "text-warning",
  danger: "text-danger",
  success: "text-success",
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
  RIGHT_DIV,
  handleDeleteSelected,
  handleExportSelected,
}: GenosTableProps) {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const toggleExpandRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const isAllSelected =
    TABLE_ROWS.length > 0 && selectedRows.length === TABLE_ROWS.length;

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

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
          {RIGHT_DIV ? RIGHT_DIV : <div></div>}
        </div>
      </div>

      <div className="overflow-auto min-h-[495px]">
        <div className="w-full">
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
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      TABLE_HEAD.length +
                      (CHECKBOXS ? 1 : 0) +
                      (ACTION_BUTTON ? 1 : 0)
                    }
                    className="text-center py-10 text-gray-500"
                  >
                    <div className="flex  items-center justify-center">
                      <ClipLoader
                        color="#3B82F6"
                        className="h-10 w-10 me-3"
                        loading={true}
                        size={30}
                      />{" "}
                      <span> Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : TABLE_ROWS.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      TABLE_HEAD.length +
                      (CHECKBOXS ? 1 : 0) +
                      (ACTION_BUTTON ? 1 : 0)
                    }
                    className="text-center py-10 text-gray-500"
                  >
                    No data available...!
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row: any, index: number) => {
                  const below = isBelowStock?.(row);
                  const above = isAboveStock?.(row);

                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={clsx(
                          "transition-all duration-300 ease-in-out border-b border-light2 hover:bg-light2",
                          selectedRows.includes(row)
                            ? "bg-primary-light3"
                            : below
                            ? "bg-red-100"
                            : above
                            ? "bg-yellow-100"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-light1"
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
                          <td
                            key={head.key}
                            className={`p-3 ${
                              head.fontWeight ? `font-${head.fontWeight}` : ""
                            }`}
                          >
                            {head.type === "currency"
                              ? formatRupiah(getNestedValue(row, head.key))
                              : getNestedValue(row, head.key)}
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
                              {ACTION_BUTTON.collapse && (
                                <button
                                  onClick={() => toggleExpandRow(index)}
                                  className="text-gray-800 hover:text-primary-color cursor-pointer transition-all duration-300"
                                >
                                  {expandedRowIndex === index ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                      {expandedRowIndex === index && (
                        <React.Fragment>
                          <tr className="bg-light2 transition-all duration-300 ease-in-out">
                            <td
                              colSpan={
                                TABLE_HEAD.length +
                                (CHECKBOXS ? 1 : 0) +
                                (ACTION_BUTTON ? 1 : 0)
                              }
                              className="p-4 text-sm text-gray-700"
                            >
                              {typeof ACTION_BUTTON?.collapse === "function" ? (
                                ACTION_BUTTON.collapse(row)
                              ) : (
                                <div className="space-y-1">
                                  <strong>Detail Data:</strong>
                                  <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 whitespace-pre-wrap break-words">
                                    {JSON.stringify(row, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
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
