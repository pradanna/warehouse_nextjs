import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import { toast } from "react-toastify";

import { formatRupiah } from "@/lib/helper";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import dayjs from "dayjs";

import { getWarehouseExpenses } from "@/lib/api/warehouse-expenses/warehouseExpensesApi";
import {
  WarehouseExpense,
  WarehouseExpenseResponse,
} from "@/lib/api/warehouse-expenses/getInterface";
import {
  deleteWarehouseExpense,
  getWarehouseExpenseById,
} from "@/lib/api/pastryOutlet/PastryOutletApi";
import AddExpensesWarehouseModal from "@/components/form/expensesWarehouse/AddExpensesWarehouseModal";
import EditExpensesWarehouseModal from "@/components/form/expensesWarehouse/EditExpensesWarehouseModal";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { generateExpensesWarehousePDF } from "@/components/PDF/printExpensesWarehouse";
import { generateExpensesWarehouseExcel } from "@/components/excel/printExpensesWarehouse";

const ExpensesWarehouseTable = () => {
  const [expensesWarehouses, setExpensesWarehouses] = useState<
    WarehouseExpense[]
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [idExpense, setIdExpense] = useState("");
  const [totalExpensesWarehouses, setTotalExpensesWarehouses] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  // FILTER
  const todayStart = dayjs().startOf("day").toDate(); // 00:00:00 lokal
  const todayEnd = dayjs().endOf("day").toDate(); // 23:59:59 lokal

  const [dateFrom, setDateFrom] = useState<Date | null>(todayStart);
  const [dateTo, setDateTo] = useState<Date | null>(todayEnd);

  const handleDownloadPDF = () => {
    generateExpensesWarehousePDF(TABLE_ROWS, {
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  const handleDownloadExcel = () => {
    generateExpensesWarehouseExcel(TABLE_ROWS, {
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  const fetchExpensesWarehouse = async (page: number) => {
    setIsLoadingTable(true);
    console.log("FETCH EXPENSES WAREHOUSES");
    try {
      const response = await getWarehouseExpenses({
        expense_category_id: idExpense,
        date_start: dayjs(dateFrom).format("YYYY-MM-DD"),
        date_end: dayjs(dateTo).format("YYYY-MM-DD"),
        page,
        per_page: limit,
      });

      console.log("EXPENSES WAREHOUSES: " + response);
      setExpensesWarehouses(response.data);
      setTotalExpensesWarehouses(response.meta.total_rows);
    } catch (err: any) {
      toast.error(err.message, {
        autoClose: 1000,
      });
      console.log(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchExpensesWarehouse(1);
  };

  // EDIT VAR
  const inputEditRef = useRef<HTMLInputElement>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchExpensesWarehouse(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      await getWarehouseExpenseById(id);
      setIdForEdit(id);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data expensesWarehouse untuk edit:", err);
    }
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "category.name", label: "Kategori", sortable: true },
    { key: "amount", label: "Jumlah", sortable: true, formatRupiah: true },
    { key: "description", label: "Keterangan", sortable: true },
    { key: "author.username", label: "Input By", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return expensesWarehouses.map((expensesWarehouse) => ({
      id: expensesWarehouse.id,
      date: expensesWarehouse.date,
      category: expensesWarehouse.category.name,
      amount: expensesWarehouse.amount,
      description: expensesWarehouse.description,
      author: expensesWarehouse.author,
    }));
  }, [expensesWarehouses]);

  useEffect(() => {
    console.log("USE EFFECT EXPENSES WAREHOUSES");
    fetchExpensesWarehouse(currentPage);
  }, [idExpense, dateFrom, dateTo, currentPage]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus expensesWarehouse ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteWarehouseExpense(id);

      toast.success("ExpensesWarehouse berhasil dihapus", {
        autoClose: 1000,
      });

      fetchExpensesWarehouse(currentPage); // refresh list
    } catch (err) {
      console.error("Gagal menghapus expensesWarehouse:", err);
      toast.error("Gagal menghapus expensesWarehouse", {
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalExpensesWarehouses}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onAddData={handleOpen}
        loading={isLoadingTable}
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4">
            <GenosDatepicker
              id="tanggal-dari"
              label="Dari Tanggal"
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
            />

            <GenosDatepicker
              id="tanggal-sampai"
              label="Sampai Tanggal"
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
            />
          </div>
        }
        RIGHT_DIV={
          <GenosDropdown
            iconLeft={<PrinterIcon className="w-5 h-5" />}
            round="md"
            color="gray"
            outlined
            align="right"
            options={[
              {
                label: "Download PDF",
                icon: <i className="fa-regular fa-file-pdf text-red-500" />,
                onClick: handleDownloadPDF,
              },
              {
                label: "Download Excel",
                icon: <i className="fa-regular fa-file-excel text-green-500" />,
                onClick: handleDownloadExcel,
              },
            ]}
          />
        }
      />

      {isModalOpen && <AddExpensesWarehouseModal show onClose={handleClose} />}

      {isModalEditOpen && (
        <EditExpensesWarehouseModal
          show
          idExpense={idForEdit}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
};

export default ExpensesWarehouseTable;
