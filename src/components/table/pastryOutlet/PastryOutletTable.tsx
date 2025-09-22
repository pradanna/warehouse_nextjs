import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import { toast } from "react-toastify";

import { formatRupiah } from "@/lib/helper";

import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import {
  deletePastrysOutlet,
  getPastrysOutlet,
  getPastrysOutletbyId,
} from "@/lib/api/pastryOutlet/PastryOutletApi";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import AddPastrysOutletModal from "@/components/form/pastryOutlet/AddPastryOutletModal";
import EditPastrysOutletModal from "@/components/form/pastryOutlet/EditPastryOutletModal";
import GenosModal from "@/components/modal/GenosModal";
import { Item } from "@/lib/api/pastryOutlet/PastryOutletInterfaceById";

interface PastrysOutletTableProps {
  outletId: string;
  outletName: string;
}

const PastrysOutletTable = ({
  outletId,
  outletName,
}: PastrysOutletTableProps) => {
  const [CartPastries, setCartPastries] = useState<Item[]>([]);

  const [pastrysOutlets, setPastrysOutlets] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPastrysOutlets, setTotalPastrysOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isLoadingTableViewTable, setIsLoadingTableViewTable] = useState(true);

  const [isModalView, setIsModalView] = useState(false);
  const [idForView, setIdForView] = useState("");

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
    fetchPastrysOutlet(1);
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchPastrysOutlet(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      await getPastrysOutletbyId(id);
      setIdForEdit(id);
    } catch (err) {
      console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
    }
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "reference_number", label: "Referensi", sortable: true },
    { key: "total", label: "Total", sortable: true },
    { key: "author", label: "author", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return pastrysOutlets.map((pastrysOutlet) => ({
      id: pastrysOutlet.id,
      date: pastrysOutlet.date,
      reference_number: pastrysOutlet.reference_number,
      total: formatRupiah(pastrysOutlet.total),
      author: pastrysOutlet.author.username,
    }));
  }, [pastrysOutlets]);

  const TABLE_HEAD_ITEMS = [
    { key: "name", label: "Nama Items", sortable: false },
    { key: "qty", label: "Qty", type: "number", sortable: false },
    { key: "price", label: "Harga", type: "currency", sortable: false },
    { key: "total", label: "Total Harga", type: "currency", sortable: false },
  ];

  const TABLE_ROWS_ITEMS = useMemo(() => {
    console.log("cart pastrys: ", CartPastries);
    return CartPastries.map((pastrysOutlet) => ({
      name: pastrysOutlet.name,
      qty: pastrysOutlet.quantity,
      price: pastrysOutlet.price,
      total: pastrysOutlet.total,
    }));
  }, [CartPastries]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (outletId) {
      fetchPastrysOutlet(1); // bisa dimulai dari page 1
    }
  }, [outletId, selectedYear, selectedMonth]);

  const handleShow = async (id: string) => {
    setIsLoadingTableViewTable(true);
    try {
      const response = await getPastrysOutletbyId(id);
      setCartPastries(response.data.items);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingTableViewTable(false);
    }
    console.log(CartPastries);
    setIsModalView(true);
    setIdForView(id);
  };

  const closeModalView = () => {
    setIsModalView(false);
  };

  const fetchPastrysOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getPastrysOutlet({
        outlet_id: outletId,
        year: selectedYear.toString(),
        month: selectedMonth.toString(),
        page,
        limit,
      });

      setPastrysOutlets(response.data);
      console.log(response.data);
      setTotalPastrysOutlets(response.meta.total_rows);
    } catch (err: any) {
      toast.error(err.message, {
        autoClose: 1000,
      });
      console.log(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  // const handleDelete = async (id: string) => {
  //   const confirmDelete = window.confirm(
  //     "Apakah Anda yakin ingin menghapus expensesOutlet ini?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     await deletePastrysOutlet(id);

  //     toast.success("PastrysOutlet berhasil dihapus", {
  //       autoClose: 1000,
  //     });

  //     fetchPastrysOutlet(currentPage); // refresh list
  //   } catch (err) {
  //     console.error("Gagal menghapus expensesOutlet:", err);
  //     toast.error("Gagal menghapus expensesOutlet", {
  //       autoClose: 1000,
  //     });
  //   }
  // };

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalPastrysOutlets}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onAddData={handleOpen}
        loading={isLoadingTable}
        ACTION_BUTTON={{
          view: (row) => {
            handleShow(row.id);
          },
          // edit: (row) => handleEdit(row.id),
          // delete: (row) => handleDelete(row.id),
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
        <AddPastrysOutletModal
          show
          onClose={handleClose}
          idOutlet={outletId}
          NameOutlet={outletName}
        />
      )}

      {isModalEditOpen && (
        <EditPastrysOutletModal
          show
          idPastry={idForEdit}
          idOutlet={outletId}
          NameOutlet={outletName}
          onClose={handleEditClose}
        />
      )}

      <GenosModal
        title="Data Items Pastrys Outlet"
        show={isModalView}
        onClose={closeModalView}
        isLoading={isLoadingTableViewTable}
      >
        <div>
          <GenosTable
            TABLE_HEAD={TABLE_HEAD_ITEMS}
            TABLE_ROWS={TABLE_ROWS_ITEMS}
          />
        </div>
      </GenosModal>
    </div>
  );
};

export default PastrysOutletTable;
