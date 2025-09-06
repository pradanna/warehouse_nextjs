import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";

import { formatRupiah } from "@/lib/helper";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import {
  deletePurchasesOutlet,
  getPurchasesOutlet,
  getPurchasesOutletbyId,
} from "@/lib/api/purchaseOutlet/PurchasesOutletApi";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import AddPurchasesOutletModal from "@/components/form/purchaseOutlet/AddPurchasesOutletModal";
import EditPurchasesOutletModal from "@/components/form/purchaseOutlet/EditPurchasesOutletModal";
import { Sale } from "@/lib/api/sales/interfaceSales";

interface PurchasesOutletTableProps {
  outletId: string;
  outletName: string;
}

const PurchasesOutletTable = ({
  outletId,
  outletName,
}: PurchasesOutletTableProps) => {
  const [purchasesOutlets, setPurchasesOutlets] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPurchasesOutlets, setTotalPurchasesOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  // FILTER
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

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
    fetchPurchasesOutlet(1);
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchPurchasesOutlet(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      await getPurchasesOutletbyId(id);
      setIdForEdit(id);
    } catch (err) {
      console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
    }
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "sale.reference_number", label: "Referensi", sortable: true },
    { key: "cash", label: "Cash", sortable: true },
    { key: "digital", label: "Digital", sortable: true },
    { key: "amount", label: "Jumlah", sortable: true },
    { key: "cash_flow.name", label: "Keterangan", sortable: true },
    { key: "total", label: "Total (referensi)", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return purchasesOutlets.map((purchasesOutlet) => ({
      id: purchasesOutlet.id,
      date: purchasesOutlet.date,
      sale: purchasesOutlet.sale,
      amount: formatRupiah(purchasesOutlet.amount),
      cash: formatRupiah(purchasesOutlet.cash),
      digital: formatRupiah(purchasesOutlet.digital),
      cash_flow: purchasesOutlet.cash_flow,
      total: formatRupiah(purchasesOutlet.sale.total),
    }));
  }, [purchasesOutlets]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (outletId) {
      fetchPurchasesOutlet(1); // bisa dimulai dari page 1
    }
  }, [outletId, selectedYear, selectedMonth]);

  const fetchPurchasesOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getPurchasesOutlet({
        outlet_id: outletId,
        year: selectedYear.toString(),
        month: selectedMonth.toString(),
        page,
        limit,
      });

      setPurchasesOutlets(response.data);
      console.log(response.data);
      setTotalPurchasesOutlets(response.meta.total);
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
      await deletePurchasesOutlet(id);

      toast.success("PurchasesOutlet berhasil dihapus", {
        autoClose: 1000,
      });

      fetchPurchasesOutlet(currentPage); // refresh list
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
        totalRows={totalPurchasesOutlets}
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
        <AddPurchasesOutletModal
          show
          onClose={handleClose}
          idOutlet={outletId}
          NameOutlet={outletName}
        />
      )}

      {isModalEditOpen && (
        <EditPurchasesOutletModal
          show
          idPurchasse={idForEdit}
          idOutlet={outletId}
          NameOutlet={outletName}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
};

export default PurchasesOutletTable;
