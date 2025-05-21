import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";

const SupplierTable = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addContact, setAddContact] = useState("");
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefAddress = useRef<HTMLInputElement>(null);
  const inputRefContact = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRefName.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setAddName("");
    setAddAddress("");
    setAddContact("");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        baseUrl + "/supplier",
        {
          name: addName,
          address: addAddress,
          contact: addContact,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setAddName("");
      setAddAddress("");
      setAddContact("");
      fetchSupplier(currentPage);
      toast.success(response.data.message || "Supplier berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRefName.current?.focus();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Gagal menambahkan supplier";
      toast.error(message, { autoClose: 1000 });
    }
  };

  // EDIT
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editContact, setEditContact] = useState("");
  const inputEditRefName = useRef<HTMLInputElement>(null);
  const inputEditRefAddress = useRef<HTMLInputElement>(null);
  const inputEditRefContact = useRef<HTMLInputElement>(null);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);

    try {
      const response = await axios.get(`${baseUrl}/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const { name, address, contact } = response.data.data;
      setEditName(name);
      setEditAddress(address);
      setEditContact(contact);

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
    setEditName("");
    setEditAddress("");
    setEditContact("");
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/supplier/${editId}`,
        {
          name: editName,
          address: editAddress,
          contact: editContact,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      fetchSupplier(currentPage);
      toast.success(response.data.message || "Supplier berhasil diperbarui", {
        autoClose: 1000,
      });
      handleEditClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah supplier";
      toast.error(message, { autoClose: 1000 });
    }
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
      const response = await axios.get(
        `${baseUrl}/supplier?param=${search}&page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuppliers(response.data.data);
      setTotalSuppliers(response.data.meta.total_rows);
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
      await axios.delete(`${baseUrl}/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

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
        <GenosModal
          title="Tambah Supplier"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Supplier"
            placeholder="Masukkan Nama Supplier"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            ref={inputRefName}
            className="mb-3"
          />
          <GenosTextfield
            label="Alamat"
            placeholder="Masukkan Alamat"
            value={addAddress}
            onChange={(e) => setAddAddress(e.target.value)}
            ref={inputRefAddress}
            className="mb-3"
          />
          <GenosTextfield
            label="Kontak"
            placeholder="Masukkan Nomor Kontak"
            value={addContact}
            onChange={(e) => setAddContact(e.target.value)}
            ref={inputRefContact}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </GenosModal>
      )}

      {isModalEditOpen && (
        <GenosModal
          title="Edit Supplier"
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Supplier"
            placeholder="Masukkan Nama Supplier"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            ref={inputEditRefName}
            className="mb-3"
          />
          <GenosTextfield
            label="Alamat"
            placeholder="Masukkan Alamat"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
            ref={inputEditRefAddress}
            className="mb-3"
          />
          <GenosTextfield
            label="Kontak"
            placeholder="Masukkan Nomor Kontak"
            value={editContact}
            onChange={(e) => setEditContact(e.target.value)}
            ref={inputEditRefContact}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmitEdit();
              }
            }}
          />
        </GenosModal>
      )}
    </div>
  );
};

export default SupplierTable;
