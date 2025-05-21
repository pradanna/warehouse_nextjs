import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import { baseUrl, getToken } from "@/app/config/config";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const UnitTable = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUnits, setTotalUnits] = useState(0);
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
      const response = await axios.post(
        baseUrl + "/unit",
        { name: addValue },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // handleClose();
      setAddValue("");
      fetchUnit(currentPage); // refresh data
      inputRef.current?.focus();
      toast.success(response.data.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Data Gagal ditambahkan";

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
      const response = await axios.get(`${baseUrl}/unit/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setEditValue(response.data.data.name);
      setIdForEdit(id);

      setTimeout(() => {
        inputEditRef.current?.focus();
        inputEditRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data unit untuk edit:", err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await axios.put(
        baseUrl + "/unit/" + idForEdit,
        { name: editValue },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // handleClose();
      setEditValue("");
      fetchUnit(currentPage); // refresh data
      handleEditClose();
      toast.success(response.data.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Data Gagal ditambahkan";

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
  const TABLE_HEAD = [{ key: "name", label: "Nama Unit", sortable: true }];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return units.map((unit) => ({
      id: unit.id,
      name: unit.name,
    }));
  }, [units]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // FILTER
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("Trigger fetch: search =", search, "page =", currentPage);
      fetchUnit(currentPage);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, currentPage]);

  const fetchUnit = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await axios.get(
        `${baseUrl}/unit?param=${search}&page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log(
        "load sukses",
        `${baseUrl}/unit?param=${search}&page=${page}&per_page=${limit}`
      );
      setUnits(response.data.data);
      setTotalUnits(response.data.meta.total_rows);
      console.log("load sukses", response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data unit:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus unit ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/unit/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Unit berhasil dihapus", {
        autoClose: 1000,
      });

      fetchUnit(currentPage); // refresh list
    } catch (err) {
      console.error("Gagal menghapus unit:", err);
      toast.error("Gagal menghapus unit", {
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
        totalRows={totalUnits}
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
              label="Cari Unit"
              placeholder="Nama unit"
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
        <GenosModal
          title="Tambah Unit"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Unit"
            placeholder="Masukan Nama Unit"
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        </GenosModal>
      )}

      {isModalEditOpen && (
        <GenosModal
          title="Edit Unit"
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
          show
          size="md"
        >
          <GenosTextfield
            label="Nama Unit"
            placeholder="Masukan Nama Unit"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDownEdit}
            ref={inputEditRef}
          />
        </GenosModal>
      )}
    </div>
  );
};

export default UnitTable;
