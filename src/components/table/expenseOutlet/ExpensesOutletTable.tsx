import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";

import AddExpensesOutletModal from "../../form/expensesOutlet/AddExpensesOutletModal";
import EditExpensesOutletModal from "../../form/expensesOutlet/EditExpensesOutletModal";
import {
  createExpensesOutlet,
  deleteExpensesOutlet,
  getExpensesOutlet,
  getExpensesOutletbyId,
  updateExpensesOutlet,
} from "@/lib/api/expensesOutletApi";
import { formatRupiah } from "@/lib/helper";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import dayjs from "dayjs";

interface ExpensesOutletTableProps {
  outletId: string;
  outletName: string;
}

const ExpensesOutletTable = ({
  outletId,
  outletName,
}: ExpensesOutletTableProps) => {
  const [expensesOutlets, setExpensesOutlets] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalExpensesOutlets, setTotalExpensesOutlets] = useState(0);
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

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchExpensesOutlet(1);
  };

  // EDIT VAR
  const inputEditRef = useRef<HTMLInputElement>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchExpensesOutlet(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      await getExpensesOutletbyId(id);
      setIdForEdit(id);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
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
    { key: "category.name", label: "kategori", sortable: true },
    { key: "cash", label: "Cash", sortable: true },
    { key: "digital", label: "Digital", sortable: true },
    { key: "amount", label: "Jumlah", sortable: true },
    { key: "description", label: "Keterangan", sortable: true },
    { key: "author.username", label: "Input By", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return expensesOutlets.map((expensesOutlet) => ({
      id: expensesOutlet.id,
      date: expensesOutlet.date,
      category: expensesOutlet.category,
      amount: formatRupiah(expensesOutlet.amount),
      cash: formatRupiah(expensesOutlet.cash),
      digital: formatRupiah(expensesOutlet.digital),
      description: expensesOutlet.description,
      author: expensesOutlet.author,
    }));
  }, [expensesOutlets]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (outletId) {
      fetchExpensesOutlet(1); // bisa dimulai dari page 1
    }
  }, [outletId, dateFrom, dateTo]);

  const fetchExpensesOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getExpensesOutlet({
        outlet_id: outletId,
        date_start: dayjs(dateFrom).format("YYYY-MM-DD"),
        date_end: dayjs(dateTo).format("YYYY-MM-DD"),
        page,
        limit,
      });

      setExpensesOutlets(response.data);
      setTotalExpensesOutlets(response.meta.total_rows);
    } catch (err: any) {
      toast.error(err.message, {
        autoClose: 1000,
      });
      console.log(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus expensesOutlet ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteExpensesOutlet(id);

      toast.success("ExpensesOutlet berhasil dihapus", {
        autoClose: 1000,
      });

      fetchExpensesOutlet(currentPage); // refresh list
    } catch (err) {
      console.error("Gagal menghapus expensesOutlet:", err);
      toast.error("Gagal menghapus expensesOutlet", {
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
        totalRows={totalExpensesOutlets}
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
      />

      {isModalOpen && (
        <AddExpensesOutletModal
          show
          onClose={handleClose}
          idOutlet={outletId}
          NameOutlet={outletName}
        />
      )}

      {isModalEditOpen && (
        <EditExpensesOutletModal
          show
          idExpense={idForEdit}
          idOutlet={outletId}
          NameOutlet={outletName}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
};

export default ExpensesOutletTable;
