import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import {
  deleteOutlet,
  getOutlet,
  getOutletById,
  updateOutlet,
} from "@/lib/api/outletApi";
import AddOutletModal from "@/components/form/outlet/AddOutletModal";
import EditOutletModal from "@/components/form/outlet/EditOutletModal";
import GenosTableFrontend from "../GenosTableFrontend";

const OutletTable = () => {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOutlets, setTotalOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD
  const inputRefName = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRefName.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = async () => {
    fetchOutlet(currentPage);
  };
  // EDIT
  const [editId, setEditId] = useState("");

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);
  };

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    setEditId("");
  };

  // TABEL
  const TABLE_HEAD = [
    { key: "name", label: "Nama Outlet", sortable: true },
    { key: "address", label: "Alamat", sortable: false },
    { key: "contact", label: "Kontak", sortable: false },
  ];

  const TABLE_ROWS = useMemo(() => {
    return outlets.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      contact: item.contact,
    }));
  }, [outlets]);

  // FETCH
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("Trigger fetch: search =", search, "page =", currentPage);
      fetchOutlet(currentPage);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchOutlet = async (page) => {
    setIsLoadingTable(true);
    try {
      const response = await getOutlet(search, page, limit);

      setOutlets(response.data);
      console.log(response.data);
      setTotalOutlets(response.meta.total_rows);
    } catch (err) {
      console.error("Gagal mengambil outlet:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus outlet ini?");
    if (!confirmDelete) return;

    try {
      await deleteOutlet(id);

      toast.success("Outlet berhasil dihapus", {
        autoClose: 1000,
      });

      fetchOutlet(currentPage);
    } catch (err) {
      console.error("Gagal menghapus outlet:", err);
      toast.error("Gagal menghapus outlet", {
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <GenosTableFrontend
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        // totalRows={totalOutlets}
        // currentPage={currentPage}
        // onPageChange={(page) => setCurrentPage(page)}
        // SORT
        onAddData={handleOpen}
        loading={isLoadingTable}
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4">
            <GenosTextfield
              id="search-outlet"
              label="Cari Outlet"
              placeholder="Nama outlet"
              className="w-100"
              is_icon_left={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      {isModalOpen && (
        <AddOutletModal show onClose={handleClose} onSuccess={handleSuccess} />
      )}

      {isModalEditOpen && (
        <EditOutletModal
          show
          editId={editId}
          onClose={handleEditClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default OutletTable;
