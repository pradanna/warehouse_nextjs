"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useMemo, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosDatepicker from "../GenosDatepicker";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import GenosTable from "@/components/table/GenosTable";
import { Payroll, PayrollItem } from "@/lib/api/payroll/payrolInterface";
import { createPayroll } from "@/lib/api/payroll/payrollApi";
import GenosSearchSelectEmployee from "@/components/select-search/EmployeeSearch";
import { formatRupiah } from "@/lib/helper";

type AddPayrollsOutletModalProps = {
  idOutlet: string;
  NameOutlet: string;
  show: boolean;
  onClose: () => void;
};

export default function AddPayrollsOutletModal({
  show,
  onClose,
  idOutlet,
  NameOutlet,
}: AddPayrollsOutletModalProps) {
  const [payrollDate, setPayrollDate] = useState<Date>(new Date());
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showModalItems, setShowModalItems] = useState(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [qtypayroll, setQtyPayroll] = useState<number>(0);

  const [totalPayroll, setTotalPayroll] = useState<number>(0);
  const [idKaryawan, setIdKaryawan] = useState<string>("");

  const TABLE_HEAD_CART_PAYROLL = [
    { key: "name", label: "Nama Karyawan", sortable: false },
    { key: "amount", label: "Total Gaji", type: "currency", sortable: false },
  ];

  const handleOpen = () => {
    setShowModalItems(true);
  };

  const closeModalItems = () => {
    setShowModalItems(false);
  };

  const TABLE_ROW_CART_PAYROLL = useMemo(() => {
    console.log("cart payrolls: ", payrollItems);
    return payrollItems.map((payrollsOutlet) => ({
      name: payrollsOutlet.employee.name,
      amount: payrollsOutlet.amount,
    }));
  }, [payrollItems]);

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      const unitData: Payroll = {
        outlet_id: idOutlet,
        amount: totalPayroll,
        date: dayjs(payrollDate).format("YYYY-MM-DD"),
        items: payrollItems,
      };

      const response = await createPayroll(unitData);
      // Lakukan aksi setelah berhasil (misalnya reset form atau tutup modal)
      console.log("Berhasil menambahkan data:", response);
      toast.success("Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan data:", err);
      toast.error(err.message || "Data Gagal ditambahkan", {
        autoClose: 1000,
      });
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Delete ID:", id);
    console.log(
      "Before:",
      payrollItems.map((i) => i.employee.name)
    );
    setPayrollItems((prev) => prev.filter((item) => item.employee.name !== id));
  };

  return (
    <GenosModal
      title={`Tambah Payroll di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex-1 flex flex-col gap-5">
          <div className="fixed z-[9998]" id="root-portal"></div>

          <GenosDatepicker
            id="expense-date"
            label="Tanggal"
            selected={payrollDate}
            onChange={(date) => setPayrollDate(date)}
          />
        </div>

        <div className="p-4 border border-gray-300 rounded-lg">
          <GenosTable
            TABLE_HEAD={TABLE_HEAD_CART_PAYROLL}
            TABLE_ROWS={TABLE_ROW_CART_PAYROLL}
            onAddData={handleOpen}
            ACTION_BUTTON={{ delete: (row) => handleDelete(row.name) }}
            FILTER={
              <div>
                <p>Daftar Items</p>
              </div>
            }
          />
          <div className="flex justify-end">
            {" "}
            Total Gaji: {formatRupiah(totalPayroll)}
          </div>
        </div>
      </div>

      <GenosModal
        show={showModalItems}
        onClose={closeModalItems}
        title="Tambah Item"
        onSubmit={() => {
          const newItems = [
            ...payrollItems,
            {
              employee_id: idKaryawan,
              amount: qtypayroll,
              employee: {
                id: idKaryawan,
                name: employeeName,
              },
            },
          ];

          setPayrollItems(newItems);

          const newTotal = newItems.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );
          setTotalPayroll(newTotal); // 👈 bikin state baru kalau perlu

          setIdKaryawan(null);
          setQtyPayroll(0);
          closeModalItems();
        }}
      >
        <div className="flex flex-col gap-5">
          <GenosSearchSelectEmployee
            label={"Cari Karyawan"}
            value={idKaryawan}
            onChange={(value, label) => {
              setEmployeeName(label);
              setIdKaryawan(value);
            }}
            placeholder={"klik untuk cari karyawan"}
          />
          <GenosTextfield
            id="total-payroll"
            label="Jumlah Gaji"
            placeholder="Masukkan Jumlah Gaji"
            type="number"
            value={qtypayroll}
            ref={inputRef}
            onChange={(e) => setQtyPayroll(Number(e.target.value))}
          />
        </div>
      </GenosModal>
    </GenosModal>
  );
}
