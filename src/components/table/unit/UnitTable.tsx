import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import { deleteUnit, getUnit } from "@/lib/api/unitApi";
import AddUnitModal from "../../form/unit/AddUnitModal";
import EditUnitModal from "../../form/unit/EditUnitModal";

const UnitTable = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalUnits, setTotalUnits] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // ADD VAR
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
  };

  const handleAddSuccess = () => {
    fetchUnit(currentPage);
    if (idForEdit !== null) {
      setIsModalEditOpen(false);
      setIdForEdit(null);
    }
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);
    setIdForEdit(id);
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

  const fetchUnit = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await getUnit(search, page, limit);

      setUnits(response.data);
      setTotalUnits(response.meta.total_rows);
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
      "Apakah Anda yakin ingin menghapus unit ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUnit(id);

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
              id="searh-unit"
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
        <AddUnitModal show onClose={handleClose} onSuccess={handleAddSuccess} />
      )}

      {isModalEditOpen && (
        <EditUnitModal
          show
          onSuccess={handleAddSuccess}
          onClose={handleEditClose}
          id={idForEdit}
        />
      )}
    </div>
  );
};

export default UnitTable;
