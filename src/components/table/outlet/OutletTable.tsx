import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import {
  createOutlet,
  deleteOutlet,
  getOutlet,
  getOutletById,
  updateOutlet,
} from "@/lib/api/outletApi";
import AddOutletModal from "@/components/form/outlet/AddOutletModal";
import EditOutletModal from "@/components/form/outlet/EditOutletModal";

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
      const response = await createOutlet(addName, addAddress, addContact);
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
      const response = await getOutletById(id);

      toast.success("Outlet berhasil diambil", {
        autoClose: 1000,
      });

      const { name, address, contact } = response.data;
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
      const response = await updateOutlet(
        editId,
        editName,
        editAddress,
        editContact
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
              id="search-outlet"
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
        <AddOutletModal
          show
          addName={addName}
          addAddress={addAddress}
          addContact={addContact}
          inputRefName={inputRefName}
          inputRefAddress={inputRefAddress}
          inputRefContact={inputRefContact}
          onClose={handleClose}
          onSubmit={handleSubmit}
          setAddAddress={setAddAddress}
          setAddContact={setAddContact}
          setAddName={setAddName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      )}

      {isModalEditOpen && (
        <EditOutletModal
          show
          editName={editName}
          editAddress={editAddress}
          editContact={editContact}
          inputEditRefName={inputEditRefName}
          inputEditRefAddress={inputEditRefAddress}
          inputEditRefContact={inputEditRefContact}
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          setEditAddress={setEditAddress}
          setEditContact={setEditContact}
          setEditName={setEditName}
        />
      )}
    </div>
  );
};

export default OutletTable;
