import { useEffect, useMemo, useRef, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import {
  deleteFundTransfer,
  findFundTransferById,
  getFundTransfers,
} from "@/lib/api/fundMovement/fundMovementApi";
import {
  getEndOfDay,
  getStartOfToday,
} from "node_modules/react-datepicker/dist/date_utils";
import { dateRange } from "@/lib/helper";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import GenosSelect from "@/components/form/GenosSelect";
import EditFundTransferModal from "@/components/form/funcMovement/EditFundMovementModal";
import AddFundTransferModal from "@/components/form/funcMovement/AddFundMovementModal";

interface FundMovementTableProps {
  outletId: string;
  outletName: string;
}
const FundMovementTable = ({
  outletId,
  outletName,
}: FundMovementTableProps) => {
  const [fundTransfers, setFundTransfers] = useState<any[]>([]);
  const [search, setSearch] = useState(""); // bisa dipakai untuk filter transfer_to misalnya

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const limit = 10;
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [dateFrom, setDateFrom] = useState<Date | null>(dateRange.todayStart);
  const [dateTo, setDateTo] = useState<Date | null>(dateRange.todayEnd);
  const [transferTo, setTransferTo] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [idForEdit, setIdForEdit] = useState("");

  // Table Head
  const TABLE_HEAD = [
    { key: "date", label: "Tanggal", sortable: true },
    { key: "amount", label: "Jumlah", sortable: true },
    { key: "transfer_to", label: "Transfer Ke", sortable: true },
    { key: "outlet_name", label: "Outlet", sortable: true },
  ];

  // Table Rows
  const TABLE_ROWS = useMemo(() => {
    return fundTransfers.map((ft) => ({
      id: ft.id,
      date: ft.date,
      amount: ft.amount.toLocaleString("id-ID"),
      transfer_to: ft.transfer_to,
      outlet_name: ft.outlet?.name || "-",
    }));
  }, [fundTransfers]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    fetchFundTransfers(currentPage, outletId);
  };

  // EDIT VAR
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const handleEditClose = () => {
    setIsModalEditOpen(false);
    fetchFundTransfers(1, outletId);
  };

  const handleEdit = async (id: string) => {
    setIdForEdit(id);
    setIsModalEditOpen(true);
  };

  useEffect(() => {
    if (!outletId) return;
    const delayDebounce = setTimeout(() => {
      fetchFundTransfers(currentPage, outletId);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [outletId, search, currentPage]);

  const fetchFundTransfers = async (page: number, outletId: string) => {
    setIsLoadingTable(true);
    console.log("Fetch fund transfer outletId =", outletId);
    try {
      const response = await getFundTransfers({
        transfer_to: search || undefined,
        outlet_id: outletId,
        page,
        per_page: limit,
      });

      setFundTransfers(response.data);
      setTotalRows(response.meta.total_rows);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data FundTransfer", {
        autoClose: 1000,
      });
      console.error(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus fund transfer ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteFundTransfer(id);
      toast.success("Fund transfer berhasil dihapus", { autoClose: 1000 });
      fetchFundTransfers(currentPage, outletId); // refresh list
    } catch (err) {
      console.error("Gagal menghapus fund transfer:", err);
      toast.error("Gagal menghapus fund transfer", { autoClose: 1000 });
    }
  };

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalRows}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        loading={isLoadingTable}
        onAddData={handleOpen}
        ACTION_BUTTON={{
          edit: (row) => {
            handleEdit(row.id);
          },
          delete: (row) => handleDelete(row.id),
        }}
        FILTER={
          <div className="flex gap-4 mb-4 items-end">
            <GenosDatepicker
              id="tanggal-dari"
              label="Dari Tanggal"
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
            />

            <GenosDatepicker
              id="tanggal-sampai"
              label="Sampai Tanggal"
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
            />

            <GenosSelect
              label="Jenis Tansfer"
              className="text-xs w-40"
              options={[
                { label: "PILIH SEMUA", value: "" },
                { label: "CASH TO DIGITAL", value: "digital" },
                { label: "DIGITAL TO CASH", value: "cash" },
              ]}
              value={transferTo}
              onChange={(e) => {
                console.log("Event:", e);
                console.log("Value:", e.target.value);
                setTransferTo(e.target.value);
              }}
            />
          </div>
        }
      />

      {isModalOpen && (
        <AddFundTransferModal
          show
          onClose={handleClose}
          outletId={outletId}
          nameOutlet={outletName}
        />
      )}

      {isModalEditOpen && (
        <EditFundTransferModal
          show
          onClose={handleEditClose}
          outletId={outletId}
          nameOutlet={outletName}
          idFundMovement={idForEdit}
        />
      )}
    </div>
  );
};

export default FundMovementTable;
