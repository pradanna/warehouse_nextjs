import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import { deleteEmployee, fetchEmployees } from "@/lib/api/employee/employeeApi";
import AddEmployeeModal from "@/components/form/employee/AddEmployeeModal";
import EditEmployeeModal from "@/components/form/employee/EditEmployeeModal";

const EmployeeTable = () => {
  const [employee, setEmployee] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployee, setTotalEmployee] = useState(0);
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
    fetchEmployee(currentPage);
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
  const TABLE_HEAD = [{ key: "name", label: "Nama Karyawan", sortable: true }];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return employee.map((unit) => ({
      id: unit.id,
      name: unit.name,
    }));
  }, [employee]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // FILTER
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("Trigger fetch: search =", search, "page =", currentPage);
      fetchEmployee(currentPage);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, currentPage]);

  const fetchEmployee = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await fetchEmployees(search, page, limit);

      setEmployee(response.data);
      setTotalEmployee(response.meta.total_rows);
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
      await deleteEmployee(id);

      toast.success("Employee berhasil dihapus", {
        autoClose: 1000,
      });

      fetchEmployee(currentPage); // refresh list
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
        totalRows={totalEmployee}
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
              label="Cari Karyawan"
              placeholder="Nama Karyawan"
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
        <AddEmployeeModal
          show
          onClose={handleClose}
          onSuccess={handleAddSuccess}
        />
      )}

      {isModalEditOpen && (
        <EditEmployeeModal
          show
          onSuccess={handleAddSuccess}
          onClose={handleEditClose}
          id={idForEdit}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
