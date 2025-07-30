import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";

import {
  deleteIncomesOutlet,
  getIncomesOutlet,
  getIncomesOutletbyId,
} from "@/lib/api/incomeOutletApi";
import { formatRupiah } from "@/lib/helper";
import AddIncomeOutletModal from "@/components/form/incomeOutlet/AddIncomeOutletModal";
import EditIncomeOutletModal from "@/components/form/incomeOutlet/EditIncomeOutletModal";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";

interface IncomesOutletTableProps {
  outletId: string;
  outletName: string;
}

const IncomesOutletTable = ({
  outletId,
  outletName,
}: IncomesOutletTableProps) => {
  const [incomeOutlets, setIncomesOutlets] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncomesOutlets, setTotalIncomesOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchIncomesOutlet(1);
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchIncomesOutlet(1);
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "cash", label: "Cash", sortable: true },
    { key: "digital", label: "Digital", sortable: true },
    { key: "total", label: "Total", sortable: true },
    { key: "by_mutation", label: "Dari Mutasi", sortable: true },
    { key: "author.username", label: "Input By", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return incomeOutlets.map((incomeOutlet) => ({
      id: incomeOutlet.id,
      date: incomeOutlet.date,
      cash: formatRupiah(incomeOutlet.cash),
      digital: formatRupiah(incomeOutlet.digital),
      by_mutation: formatRupiah(incomeOutlet.by_mutation),
      total: formatRupiah(incomeOutlet.total),
      author: incomeOutlet.author,
    }));
  }, [incomeOutlets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (outletId) {
      fetchIncomesOutlet(1); // bisa dimulai dari page 1
    }
  }, [outletId, selectedYear, selectedMonth]);

  const fetchIncomesOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getIncomesOutlet({
        outlet_id: outletId,
        year: selectedYear.toString(),
        month: selectedMonth.toString(),
        page,
        limit,
      });

      setIncomesOutlets(response.data);
      setTotalIncomesOutlets(response?.meta?.total_rows ?? 0);
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
      "Apakah Anda yakin ingin menghapus incomeOutlet ini?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteIncomesOutlet(id);

      toast.success("IncomesOutlet berhasil dihapus", {
        autoClose: 1000,
      });

      fetchIncomesOutlet(currentPage); // refresh list
    } catch (err) {
      console.error("Gagal menghapus incomeOutlet:", err);
      toast.error("Gagal menghapus incomeOutlet", {
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
        totalRows={totalIncomesOutlets}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onAddData={handleOpen}
        loading={isLoadingTable}
        // ACTION_BUTTON={{
        //   edit: (row) => handleEdit(row.id),
        //   delete: (row) => handleDelete(row.id),
        // }}
        FILTER={
          <div className="flex gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-4 me-5">
              <div>
                <label className="block text-sm font-medium">Tahun</label>
                <YearDropdown value={selectedYear} onChange={setSelectedYear} />
              </div>
              <div>
                <label className="block text-sm font-medium">Bulan</label>
                <MonthDropdown
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                />
              </div>
            </div>
          </div>
        }
      />

      {isModalOpen && (
        <AddIncomeOutletModal
          show
          onClose={handleClose}
          idOutlet={outletId}
          NameOutlet={outletName}
        />
      )}

      {isModalEditOpen && (
        <EditIncomeOutletModal
          show
          idIncome={idForEdit}
          idOutlet={outletId}
          NameOutlet={outletName}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
};

export default IncomesOutletTable;
