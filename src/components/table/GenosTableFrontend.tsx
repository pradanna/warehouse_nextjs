// components/GenosTableFrontend.tsx
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
import { formatNumber, formatRupiah } from "@/lib/helper";
import GenosTextfield from "../form/GenosTextfield";

type TableHead = {
  key: string;
  label: string;
  sortable?: boolean;
  isTextField?: boolean;
  type?: "text" | "currency" | "number" | string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | string;
  onClick?: (row: any) => void;
};

type ActionType = {
  pilih?: (row: any) => void;
  view?: (row: any) => void;
  edit?: (row: any) => void;
  delete?: (row: any) => void;
  collapse?: boolean | ((row: any) => React.ReactNode);
};

type GenosTableFrontendProps = {
  TABLE_HEAD: TableHead[];
  TABLE_ROWS: any[];
  CHECKBOXS?: boolean;
  SORT?: boolean;
  onAddData?: () => void;
  handleExportSelected?: () => void;
  handleDeleteSelected?: () => void;
  handleTableField?: (row, head_key, value) => void;
  PAGINATION?: boolean;
  FILTER?: React.ReactNode; // slot komponen filter
  RIGHT_DIV?: React.ReactNode;
  ACTION_BUTTON?: ActionType;
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl";
  rowsPerPage?: number;
  isDanger?: (row: any) => boolean;
  isWarning?: (row: any) => boolean;
  isGreat?: (row: any) => boolean;
  isBold?: (row: any) => boolean;
  loading?: boolean;
  error?: boolean;
  customMinheight?: string;
};

const fontSizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

export default function GenosTableFrontend({
  TABLE_HEAD,
  TABLE_ROWS,
  CHECKBOXS = false,
  rowsPerPage = 10,
  SORT = false,
  PAGINATION = false,
  FILTER,
  fontSize = "sm",
  ACTION_BUTTON,
  loading,
  error,
  isDanger,
  isWarning,
  isGreat,
  isBold,
  onAddData,
  RIGHT_DIV,
  handleDeleteSelected,
  handleExportSelected,
  customMinheight = "min-h-[495px]",
}: GenosTableFrontendProps) {
  const [pageSize, setPageSize] = useState(rowsPerPage);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isAllSelected =
    TABLE_ROWS.length > 0 && selectedRows.length === TABLE_ROWS.length;

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Filtering → default tidak diubah datanya
  const filteredRows = useMemo(() => {
    return TABLE_ROWS;
  }, [TABLE_ROWS]);

  // Sorting
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });
  }, [filteredRows, sortKey, sortOrder]);

  // Pagination frontend
  const totalPages = useMemo(() => {
    return PAGINATION ? Math.ceil(sortedRows.length / pageSize) : 1;
  }, [sortedRows, pageSize, PAGINATION]);

  const paginatedRows = useMemo(() => {
    if (!PAGINATION) {
      // kalau pagination dimatikan, langsung tampil semua
      return sortedRows;
    }
    return sortedRows.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedRows, currentPage, pageSize, PAGINATION]);

  const handleSort = (key: string) => {
    let newOrder: "asc" | "desc" = "asc";
    if (sortKey === key) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortKey(key);
    setSortOrder(newOrder);
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

  if (error) {
    return (
      <div className="p-4 text-center text-red-500  min-h-[595px]">
        Error:....
      </div>
    );
  }

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      {/* FILTER Section */}
      {FILTER && <div className="mb-4">{FILTER}</div>}

      <div className="flex flex-nowrap justify-between">
        <div></div>
        <div className="flex gap-2">
          {handleDeleteSelected && (
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
          )}
          {handleExportSelected && (
            <GenosButton
              label="Export"
              onClick={handleExportSelected}
              iconLeft={<ArrowDownTrayIcon className="w-4 h-4" />}
              color="warning"
              size="sm"
              round="md"
              selfStart
              outlined
            />
          )}
          {onAddData && (
            <GenosButton
              label="Tambah Data"
              onClick={onAddData}
              iconLeft={<PlusIcon className="w-4 h-4" />}
              color="success"
              size="md"
              round="md"
              selfStart
            />
          )}
          {RIGHT_DIV}
        </div>
      </div>

      <div className={clsx("overflow-auto", customMinheight)}>
        <table
          className={clsx(
            "w-full table-auto border-collapse",
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
                  onClick={() => SORT && head.sortable && handleSort(head.key)}
                >
                  <div className="flex items-center gap-1">
                    {head.label}
                    {SORT && head.sortable && (
                      <div className="flex flex-col ml-1 leading-none">
                        <ChevronUpIcon
                          className={clsx(
                            "w-2 h-2 text-gray-400",
                            sortKey === head.key &&
                              sortOrder === "asc" &&
                              "text-primary-color w-3 h-3"
                          )}
                        />
                        <ChevronDownIcon
                          className={clsx(
                            "w-2 h-2 text-gray-400",
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
          <tbody>
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
                  Loading...
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
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
              paginatedRows.map((row, index) => {
                const danger = isDanger?.(row);
                const great = isGreat?.(row);
                const warning = isWarning?.(row);
                const bold = isBold?.(row);

                return (
                  <tr
                    key={index}
                    className={clsx(
                      "border-b border-light2 hover:bg-light2",
                      isBold && bold ? "font-bold" : "",
                      selectedRows.includes(row)
                        ? "bg-primary-light3"
                        : danger
                        ? "bg-red-50"
                        : warning
                        ? "bg-yellow-50"
                        : great
                        ? "bg-green-50"
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
                      <td key={head.key} className="p-3">
                        {head.type === "currency"
                          ? formatRupiah(getNestedValue(row, head.key))
                          : head.type === "number"
                          ? formatNumber(getNestedValue(row, head.key))
                          : getNestedValue(row, head.key)}
                      </td>
                    ))}

                    {ACTION_BUTTON && (
                      <td className="p-3">
                        <div className="flex gap-3 justify-center">
                          {ACTION_BUTTON.view && (
                            <EyeIcon
                              onClick={() => ACTION_BUTTON.view?.(row)}
                              className="h-5 w-5 cursor-pointer hover:text-success-base"
                            />
                          )}
                          {ACTION_BUTTON.edit && (
                            <PencilSquareIcon
                              onClick={() => ACTION_BUTTON.edit?.(row)}
                              className="h-5 w-5 cursor-pointer hover:text-warning-base"
                            />
                          )}
                          {ACTION_BUTTON.delete && (
                            <TrashIcon
                              onClick={() => ACTION_BUTTON.delete?.(row)}
                              className="h-5 w-5 cursor-pointer hover:text-danger-base"
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {PAGINATION && (
        <div className="flex items-center justify-between mt-3">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // reset halaman
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination */}
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
