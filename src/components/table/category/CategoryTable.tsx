import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosTextarea from "../../form/GenosTextArea";

const CategoryTable = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefDeskripsi = useRef<HTMLTextAreaElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setAddName("");
    setAddDescription("");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        baseUrl + "/category",
        {
          name: addName,
          description: addDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setAddName("");
      setAddDescription("");
      fetchCategory(currentPage);
      toast.success(response.data.message || "Kategori berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRef.current?.focus();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Gagal menambahkan kategori";
      toast.error(message, { autoClose: 1000 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // EDIT
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const inputEditRef = useRef<HTMLInputElement>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const inputRefDeskripsiEdit = useRef<HTMLTextAreaElement>(null);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);

    try {
      const response = await axios.get(`${baseUrl}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const { name, description } = response.data.data;
      setEditName(name);
      setEditDescription(description);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    }
  };

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    setEditId("");
    setEditName("");
    setEditDescription("");
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/category/${editId}`,
        {
          name: editName,
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      fetchCategory(currentPage);
      toast.success(response.data.message || "Kategori berhasil diperbarui", {
        autoClose: 1000,
      });
      handleEditClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah kategori";
      toast.error(message, { autoClose: 1000 });
    }
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitEdit();
    }
  };

  // TABEL
  const TABLE_HEAD = [
    { key: "name", label: "Nama Kategori", sortable: true },
    { key: "description", label: "Deskripsi", sortable: false },
  ];

  const TABLE_ROWS = useMemo(() => {
    return categories.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }));
  }, [categories]);

  // FETCH
  useEffect(() => {
    console.log("token", getToken());
    const delay = setTimeout(() => {
      fetchCategory(currentPage);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchCategory = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await axios.get(
        `${baseUrl}/category?param=${search}&page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCategories(response.data.data);
      setTotalCategories(response.data.meta.total_rows);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus kategori ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Kategori berhasil dihapus", {
        autoClose: 1000,
      });

      fetchCategory(currentPage);
    } catch (err) {
      console.error("Gagal menghapus kategori:", err);
      toast.error("Gagal menghapus kategori", {
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
        totalRows={totalCategories}
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
              id="cari-kategori"
              label="Cari Kategori"
              placeholder="Nama kategori"
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
          title="Tambah Kategori"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="md"
        >
          <GenosTextfield
            id="tambah-nama-kategori"
            label="Nama Kategori"
            placeholder="Masukkan Nama Kategori"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            ref={inputRef}
            className="mb-3"
          />
          <GenosTextarea
            label="Deskripsi"
            placeholder="Masukkan Deskripsi"
            value={addDescription}
            onKeyDown={handleKeyDown}
            ref={inputRefDeskripsi}
            onChange={(e) => setAddDescription(e.target.value)}
          />
        </GenosModal>
      )}

      {isModalEditOpen && (
        <GenosModal
          title="Edit Kategori"
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          show
          size="md"
        >
          <GenosTextfield
            id="edit-nama-kategori"
            label="Nama Kategori"
            placeholder="Masukkan Nama Kategori"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            ref={inputEditRef}
            className="mb-3"
          />
          <GenosTextarea
            label="Deskripsi"
            placeholder="Masukkan Deskripsi"
            value={editDescription}
            onKeyDown={handleKeyDownEdit}
            ref={inputRefDeskripsiEdit}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </GenosModal>
      )}
    </div>
  );
};

export default CategoryTable;
