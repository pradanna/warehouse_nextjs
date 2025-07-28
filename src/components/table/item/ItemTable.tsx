import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import GenosSearchSelect from "../../form/GenosSearchSelect";
import { getCategories } from "@/lib/api/categoryApi";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "@/lib/api/itemApi";
import AddItemModal from "@/components/form/item/AddItemModal";
import EdititemModal from "@/components/form/item/EditItemModal";

const ItemTable = () => {
  type Category = {
    id: string;
    name: string;
  };

  type MaterialCategory = {
    id: string;
    name: string;
  };

  type Item = {
    id: string;
    name: string;
    category?: Category;
    material_category?: MaterialCategory;
  };

  // Data Items
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined | number
  >(undefined);
  const [allItems, setAllItems] = useState<Item[]>([]);

  // Data Kategori untuk dropdown
  const [categories, setCategories] = useState<Category[]>([]);

  // ADD
  const [addCategoryId, setAddCategoryId] = useState<string>("");
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");

  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // EDIT
  const [editId, setEditId] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const inputEditRefName = useRef<HTMLInputElement>(null);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  // TABLE HEAD
  const TABLE_HEAD = [
    { key: "category", label: "Kategori", sortable: false },
    {
      key: "material_category",
      label: "Kategori Bahan Baku",
      sortable: true,
    },
    { key: "name", label: "Nama Item", sortable: true },
    { key: "description", label: "Deskripsi", sortable: false },
  ];

  // Mapping items with category name
  const TABLE_ROWS = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      category: item.category?.name ?? "-",
      material_category: item.material_category?.name ?? "-",
      name: item.name,
      description: item.description,
    }));
  }, [items]);

  // Fetch kategori
  const fetchCategories = async () => {
    try {
      const res = await getCategories("", 1, 1000);
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    }
  };

  // Fetch items
  const fetchItems = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const res = await getItems(search, page, limit);
      setItems(res.data);
      setAllItems(res.data); // simpan semua data
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      console.error("Gagal fetch items:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  //   SEARCH CATEGORY

  useEffect(() => {
    let filtered = allItems;

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category?.id === selectedCategory
      );
    }

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setItems(filtered);
  }, [allItems, search, selectedCategory]);

  // Initial fetch categories + fetch items on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchItems(currentPage);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // HANDLE ADD
  const handleOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => inputRefName.current?.focus(), 100);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setAddCategoryId("");
    setAddName("");
    setAddDescription("");

    fetchItems(currentPage);
  };

  // HANDLE EDIT
  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);
    try {
      const res = await getItemById(id);

      const data = res.data;
      setEditCategoryId(data.category.id);
      setEditName(data.name);
      setEditDescription(data.description);

      console.log("Edit category id:", editCategoryId);
      console.log("Category options:", categories);

      setTimeout(() => {
        inputEditRefName.current?.focus();
        inputEditRefName.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal fetch data item:", err);
    }
  };

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    setEditId("");
    setEditCategoryId("");
    setEditName("");
    setEditDescription("");
    fetchItems(currentPage);
  };

  // HANDLE DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    try {
      await deleteItem(id);
      toast.success("Item berhasil dihapus", { autoClose: 1000 });
      fetchItems(currentPage);
    } catch (err) {
      console.error("Gagal hapus item:", err);
      toast.error("Gagal menghapus item", { autoClose: 1000 });
    }
  };

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAddData={handleOpen}
        loading={isLoadingTable}
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4 items-end">
            <GenosSearchSelect
              label="Kategori"
              placeholder="Pilih kategori"
              className="w-64 text-xs"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={selectedCategory}
              onChange={(val: any) => setSelectedCategory(val)}
            />

            <GenosTextfield
              id="search-item"
              label="Cari Item"
              placeholder="Nama item"
              className="w-full"
              is_icon_left={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      ></GenosTable>

      {isModalOpen && <AddItemModal show onClose={handleClose} />}

      {isModalEditOpen && (
        <EdititemModal show itemId={editId} onClose={handleEditClose} />
      )}
    </div>
  );
};

export default ItemTable;
