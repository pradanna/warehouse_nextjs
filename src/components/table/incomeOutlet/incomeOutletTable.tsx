import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";

import {
  createIncomesOutlet,
  deleteIncomesOutlet,
  getIncomesOutlet,
  getIncomesOutletbyId,
  updateIncomesOutlet,
} from "@/lib/api/incomeOutletApi";
import { formatRupiah } from "@/lib/helper";
import AddIncomeOutletModal from "@/components/form/incomeOutlet/AddIncomeOutletModal";
import EditIncomeOutletModal from "@/components/form/incomeOutlet/EditIncomeOutletModal";

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

  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncomesOutlets, setTotalIncomesOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchIncomesOutlet(1);
  };

  // EDIT VAR
  const [editValue, setEditValue] = useState("");
  const inputEditRef = useRef<HTMLInputElement>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchIncomesOutlet(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      const response = await getIncomesOutletbyId(id);
      setEditValue(response.data.name);
      setIdForEdit(id);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data incomeOutlet untuk edit:", err);
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
    { key: "amount", label: "Jumlah", sortable: true },
    { key: "description", label: "Keterangan", sortable: true },
    { key: "author.username", label: "Input By", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return incomeOutlets.map((incomeOutlet) => ({
      id: incomeOutlet.id,
      date: incomeOutlet.date,
      category: incomeOutlet.category,
      amount: formatRupiah(incomeOutlet.amount),
      description: incomeOutlet.description,
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
  }, [outletId]);

  const fetchIncomesOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getIncomesOutlet({
        outlet_id: outletId,
        page,
        limit,
      });

      setIncomesOutlets(response.data);
      setTotalIncomesOutlets(response.meta.total_rows);
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
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4">
            <GenosTextfield
              id="searh-incomeOutlet"
              label="Cari Kategori Pengeluaran"
              placeholder="Nama incomeOutlet"
              className="w-full"
              value={search}
              is_icon_left={true}
              onChange={(e) => {
                console.log("onChange:", e.target.value);
                setSearch(e.target.value);
              }}
            />
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
