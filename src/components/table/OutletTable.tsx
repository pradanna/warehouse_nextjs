import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";

const OutletTable = () => {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOutlets, setTotalOutlets] = useState(0);
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
        baseUrl + "/outlet",
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
      fetchOutlet(currentPage);
      toast.success(response.data.message || "Outlet berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRefName.current?.focus();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal menambahkan outlet";
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
      const response = await axios.get(`${baseUrl}/outlet/${id}`, {
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
      console.error("Gagal mengambil data outlet:", err);
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
        `${baseUrl}/outlet/${editId}`,
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
      fetchOutlet(currentPage);
      toast.success(response.data.message || "Outlet berhasil diperbarui", {
        autoClose: 1000,
      });
      handleEditClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah outlet";
      toast.error(message, { autoClose: 1000 });
    }
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
    const delay = setTimeout(() => {
      fetchOutlet(currentPage);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchOutlet = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await axios.get(
        `${baseUrl}/outlet?param=${search}&page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setOutlets(response.data.data);
      setTotalOutlets(response.data.meta.total_rows);
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
      await axios.delete(`${baseUrl}/outlet/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

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
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalOutlets}
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
              label="Cari Outlet"
              placeholder="Nama outlet"
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
          title="Tambah Outlet"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Outlet"
            placeholder="Masukkan Nama Outlet"
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
          title="Edit Outlet"
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Outlet"
            placeholder="Masukkan Nama Outlet"
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

export default OutletTable;
