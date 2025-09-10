import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import { toast } from "react-toastify";

import { formatRupiah } from "@/lib/helper";

import MonthDropdown from "@/components/dropdown-button/MonthDropDown";

import AddPayrollsOutletModal from "@/components/form/payrollOutlet/AddPayrollOutletModal";
import EditPayrollsOutletModal from "@/components/form/payrollOutlet/EditPayrollOutletModal";
import GenosModal from "@/components/modal/GenosModal";
import { PayrollItem } from "@/lib/api/payroll/payrolInterface";
import {
  fetchAllPayrolls,
  fetchPayrollById,
} from "@/lib/api/payroll/payrollApi";
import YearDropdown from "@/components/dropdown-button/YearDropDown";

interface PayrollsOutletTableProps {
  outletId: string;
  outletName: string;
}

const PayrollsOutletTable = ({
  outletId,
  outletName,
}: PayrollsOutletTableProps) => {
  const [CartPayrolls, setCartPayrolls] = useState<PayrollItem[]>([]);

  const [payrollsOutlets, setPayrollsOutlets] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPayrollsOutlets, setTotalPayrollsOutlets] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isLoadingTableViewTable, setIsLoadingTableViewTable] = useState(true);

  const [isModalView, setIsModalView] = useState(false);

  // ADD VAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");

  // FILTER
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchPayrollsOutlet(1);
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchPayrollsOutlet(1);
  };

  const handleEdit = async (id: string) => {
    setIsModalEditOpen(true);

    console.log("ID untuk edit:", id);
    try {
      await fetchPayrollById(id);
      setIdForEdit(id);
    } catch (err) {
      console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
    }
  };

  // TABLE HEADER
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "total", label: "Total", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return payrollsOutlets.map((payrollsOutlet) => ({
      date: payrollsOutlet.date,
      total: formatRupiah(payrollsOutlet.amount),
    }));
  }, [payrollsOutlets]);

  const TABLE_HEAD_ITEMS = [
    { key: "name", label: "Nama Karyawan", sortable: false },
    { key: "amount", label: "Gaji", type: "currency", sortable: false },
  ];

  const TABLE_ROWS_ITEMS = useMemo(() => {
    console.log("cart payrolls: ", CartPayrolls);
    return CartPayrolls.map((payrollsOutlet) => ({
      name: payrollsOutlet.employee.name,
      amount: payrollsOutlet.amount,
    }));
  }, [CartPayrolls]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (outletId) {
      fetchPayrollsOutlet(1); // bisa dimulai dari page 1
    }
  }, [outletId, selectedYear, selectedMonth]);

  const handleShow = async (id: string) => {
    setIsLoadingTableViewTable(true);
    try {
      const response = await fetchPayrollById(id);
      setCartPayrolls(response.data.items);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingTableViewTable(false);
    }
    console.log(CartPayrolls);
    setIsModalView(true);
    // setIdForView(id);
  };

  const closeModalView = () => {
    setIsModalView(false);
  };

  const fetchPayrollsOutlet = async (page: number) => {
    setIsLoadingTable(true);

    try {
      const response = await fetchAllPayrolls(
        outletId,
        selectedYear.toString(),
        selectedMonth.toString(),
        page,
        limit
      );

      setPayrollsOutlets(response.data);
      console.log("RESPONSE :" + response.data);
      setTotalPayrollsOutlets(response.meta.total_rows);
    } catch (err: any) {
      toast.error(err.message, {
        autoClose: 1000,
      });
      console.log(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  // const handleDelete = async (id: string) => {
  //   const confirmDelete = window.confirm(
  //     "Apakah Anda yakin ingin menghapus expensesOutlet ini?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     await deletePayrollsOutlet(id);

  //     toast.success("PayrollsOutlet berhasil dihapus", {
  //       autoClose: 1000,
  //     });

  //     fetchPayrollsOutlet(currentPage); // refresh list
  //   } catch (err) {
  //     console.error("Gagal menghapus expensesOutlet:", err);
  //     toast.error("Gagal menghapus expensesOutlet", {
  //       autoClose: 1000,
  //     });
  //   }
  // };

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalPayrollsOutlets}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onAddData={handleOpen}
        loading={isLoadingTable}
        ACTION_BUTTON={{
          view: (row) => {
            handleShow(row.id);
          },
          // edit: (row) => handleEdit(row.id),
          // delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-4 me-5">
              <div>
                <label className="block text-sm font-medium">Tahun</label>
                <YearDropdown value={selectedYear} onChange={setSelectedYear} />
              </div>
              <div>
                <label className="block text-sm font-medium">Bulan</label>
                <MonthDropdown
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                />
              </div>
            </div>
          </div>
        }
      />

      {isModalOpen && (
        <AddPayrollsOutletModal
          show
          onClose={handleClose}
          idOutlet={outletId}
          NameOutlet={outletName}
        />
      )}

      {/* {isModalEditOpen && (
        <EditPayrollsOutletModal
          show
          idPayroll="idForEdit"
          idOutlet={outletId}
          NameOutlet={outletName}
          onClose={handleEditClose}
        />
      )} */}

      <GenosModal
        title="Data Items Payrolls Outlet"
        show={isModalView}
        onClose={closeModalView}
        isLoading={isLoadingTableViewTable}
      >
        <div>
          <GenosTable
            TABLE_HEAD={TABLE_HEAD_ITEMS}
            TABLE_ROWS={TABLE_ROWS_ITEMS}
          />
        </div>
      </GenosModal>
    </div>
  );
};

export default PayrollsOutletTable;
