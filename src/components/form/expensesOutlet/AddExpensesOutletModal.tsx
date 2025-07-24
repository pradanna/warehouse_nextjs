"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosDatepicker from "../GenosDatepicker";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";
import GenosTextarea from "../GenosTextArea";
import { createExpensesOutlet } from "@/lib/api/expensesOutletApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

type AddExpensesOutletModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function AddExpensesOutletModal({
  show,
  onClose,
}: AddExpensesOutletModalProps) {
  const [addOutletId, setAddOutletId] = useState<string>("");
  const [addCategoryId, setAddCategoryId] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [addAmount, setAddAmount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const amountChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAddAmount(isNaN(value) ? 0 : value);
  };

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setAddDescription(value);
    };

  const onSubmit = async () => {
    try {
      console.log("addAmount: " + addAmount.toString());
      const unitData = {
        outlet_id: addOutletId,
        expense_category_id: addCategoryId,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: addAmount,
        description: addDescription,
      };

      const response = await createExpensesOutlet(unitData);
      // Lakukan aksi setelah berhasil (misalnya reset form atau tutup modal)
      console.log("Berhasil menambahkan data:", response);
      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan data:", err);
      toast.error(err.message || "Data Gagal ditambahkan", {
        autoClose: 1000,
      });
    }
  };

  return (
    <GenosModal
      title="Tambah kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <GenosSearchSelectOutlet
          value={addOutletId}
          onChange={setAddOutletId}
          placeholder="Pilih Outlet"
          label="OutletId"
        />

        <GenosSearchSelectExpenseCategory
          value={addCategoryId}
          onChange={setAddCategoryId}
          placeholder="Pilih Kategori Pengeluaran"
          label="Kategori Pengeluaran"
        />
        <div className="fixed z-[9998]" id="root-portal"></div>
        <GenosDatepicker
          id="expense-date"
          label="Tanggal"
          selected={expenseDate}
          onChange={(date) => setExpenseDate(date)}
        />

        <GenosTextfield
          id="add-amount-expense"
          label="Jumlah Pengeluaran"
          placeholder="Masukkan Jumlah Pengeluaran"
          type="number"
          value={addAmount}
          ref={inputRef}
          onChange={(e) => setAddAmount(Number(e.target.value))}
        />

        <GenosTextarea
          label="Deskripsi"
          placeholder="Masukkan Deskripsi"
          value={addDescription}
          onKeyDown={descriptionChange}
          ref={ref}
          onChange={(e) => setAddDescription(e.target.value)}
        />
      </div>
    </GenosModal>
  );
}
