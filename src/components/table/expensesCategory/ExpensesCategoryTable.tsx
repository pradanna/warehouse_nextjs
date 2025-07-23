import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";

import AddExpensesCategoryModal from "../../form/expensesCategory/AddExpensesCategoryModal";
import EditExpensesCategoryModal from "../../form/expensesCategory/EditExpensesCategoryModal";
import {
  createExpensesCategory,
  deleteExpensesCategory,
  getExpensesCategory,
  getExpensesCategorybyId,
  updateExpensesCategory,
} from "@/lib/api/expensesCategoryApi";

const ExpensesCategoryTable = () => {
  const [expensesCategorys, setExpensesCategorys] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExpensesCategorys, setTotalExpensesCategorys] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
  const [addValue, setAddValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  const handleOpen = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setName("");
  };

  const handleSubmit = async () => {
    try {
      const response = await createExpensesCategory({ name: addValue });
      setAddValue("");
      fetchExpensesCategory(currentPage); // refresh data
      inputRef.current?.focus();
      console.log(response.message);
      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
    } catch (err: any) {
      const message = err.response?.message || "Data Gagal ditambahkan";

      console.log(err.response?.message);
      toast.error(message, {
        autoClose: 1000,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // EDIT VAR
  const [editValue, setEditValue] = useState("");
  const inputEditRef = useRef<HTMLInputElement>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      const response = await getExpensesCategorybyId(id);
      setEditValue(response.data.name);
      setIdForEdit(id);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data expensesCategory untuk edit:", err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await updateExpensesCategory(idForEdit, editValue);
      // handleClose();
      setEditValue("");
      fetchExpensesCategory(currentPage); // refresh data
      handleEditClose();
      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
    } catch (err: any) {
      const message = err.response?.message || "Data Gagal ditambahkan";

      toast.error(message, {
        autoClose: 1000,
      });
    }
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitEdit();
    }
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "name", label: "Nama ExpensesCategory", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return expensesCategorys.map((expensesCategory) => ({
      id: expensesCategory.id,
      name: expensesCategory.name,
    }));
  }, [expensesCategorys]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // FILTER
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("Trigger fetch: search =", search, "page =", currentPage);
      fetchExpensesCategory(currentPage);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, currentPage]);

  const fetchExpensesCategory = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getExpensesCategory(search, page, limit);

      setExpensesCategorys(response.data);
      setTotalExpensesCategorys(response.meta.total_rows);
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
      "Apakah Anda yakin ingin menghapus expensesCategory ini?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteExpensesCategory(id);

      toast.success("ExpensesCategory berhasil dihapus", {
        autoClose: 1000,
      });

      fetchExpensesCategory(currentPage); // refresh list
    } catch (err) {
      console.error("Gagal menghapus expensesCategory:", err);
      toast.error("Gagal menghapus expensesCategory", {
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
        totalRows={totalExpensesCategorys}
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
              id="searh-expensesCategory"
              label="Cari Kategori Pengeluaran"
              placeholder="Nama expensesCategory"
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
        <AddExpensesCategoryModal
          show
          addValue={addValue}
          setAddValue={setAddValue}
          inputRef={inputRef}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}

      {isModalEditOpen && (
        <EditExpensesCategoryModal
          show
          editValue={editValue}
          setEditValue={setEditValue}
          inputRef={inputEditRef}
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          onKeyDown={handleKeyDownEdit}
        />
      )}
    </div>
  );
};

export default ExpensesCategoryTable;
