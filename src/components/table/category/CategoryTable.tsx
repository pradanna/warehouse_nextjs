import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosTextarea from "../../form/GenosTextArea";
import {
  createCategory,
  deleteCategory,
  editCategory,
  findCategoryById,
} from "@/lib/api/categoryApi";
import AddCategoryModal from "@/components/form/category/AddCategoryModal";
import EditCategoryModal from "@/components/form/category/EditCategoryModal";

const CategoryTable = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleOnSuccess = () => {
    fetchCategory(currentPage);
  };

  // EDIT
  const [editId, setEditId] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleGetEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);
  };

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    setEditId("");
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
      await deleteCategory(id);

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
          edit: (row) => handleGetEdit(row.id),
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
        <AddCategoryModal
          show
          onClose={handleClose}
          onSuccess={handleOnSuccess}
        />
      )}

      {isModalEditOpen && (
        <EditCategoryModal
          show
          onClose={handleEditClose}
          onSuccess={handleOnSuccess}
          editCategoryId={editId}
        />
      )}
    </div>
  );
};

export default CategoryTable;
