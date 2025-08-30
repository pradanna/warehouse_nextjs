import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierById,
} from "@/lib/api/supplierApi";
import AddSupplierModal from "@/components/form/supplier/AddSupplierModal";
import EditSupplierModal from "@/components/form/supplier/EditSupplierModal";

const SupplierTable = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
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

  const handleOnsuccess = () => {
    fetchSupplier(currentPage);
  };

  // EDIT
  const [editId, setEditId] = useState("");
  const inputEditRefName = useRef<HTMLInputElement>(null);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);

    try {
      const response = await getSupplierById(id);

      const { name, address, contact } = response.data;

      setTimeout(() => {
        inputEditRefName.current?.focus();
        inputEditRefName.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data supplier:", err);
    }
  };

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    setEditId("");
  };

  // TABEL
  const TABLE_HEAD = [
    { key: "name", label: "Nama Supplier", sortable: true },
    { key: "address", label: "Alamat", sortable: false },
    { key: "contact", label: "Kontak", sortable: false },
  ];

  const TABLE_ROWS = useMemo(() => {
    return suppliers.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      contact: item.contact,
    }));
  }, [suppliers]);

  // FETCH
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSupplier(currentPage);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchSupplier = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await getSupplier(search, page, limit);

      console.log(response.data);

      setSuppliers(response.data);
      setTotalSuppliers(response.meta.total_rows);
    } catch (err) {
      console.error("Gagal mengambil supplier:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus supplier ini?");
    if (!confirmDelete) return;

    try {
      await deleteSupplier(id);

      toast.success("Supplier berhasil dihapus", {
        autoClose: 1000,
      });

      fetchSupplier(currentPage);
    } catch (err) {
      console.error("Gagal menghapus supplier:", err);
      toast.error("Gagal menghapus supplier", {
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
        totalRows={totalSuppliers}
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
              id="search-supplier"
              label="Cari Supplier"
              placeholder="Nama supplier"
              className="w-full"
              is_icon_left={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      {isModalOpen && (
        <AddSupplierModal
          onClose={handleClose}
          onSuccess={handleOnsuccess}
          show
        />
      )}

      {isModalEditOpen && (
        <EditSupplierModal
          show
          onClose={handleEditClose}
          onSuccess={handleOnsuccess}
          id={editId}
        />
      )}
    </div>
  );
};

export default SupplierTable;
