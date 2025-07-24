"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import dayjs from "dayjs";
import {
  createExpensesOutlet,
  getExpensesOutletbyId,
} from "@/lib/api/expensesOutletApi";
import { toast } from "react-toastify";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";
import GenosDatepicker from "../GenosDatepicker";
import GenosTextarea from "../GenosTextArea";
import { formatDateToDateIndo } from "@/lib/helper";

type EditExpensesOutletModalProps = {
  show: boolean;
  idExpense: string;
  onClose: () => void;
};

export default function EditExpensesOutletModal({
  show,
  idExpense,
  onClose,
}: EditExpensesOutletModalProps) {
  const [editOutletId, setEditOutletId] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [editAmount, setEditAmount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const fetchDataForEdit = async (id: string) => {
    try {
      const response = await getExpensesOutletbyId(id);
      if (!response) return;

      setEditOutletId(response.data.outlet_id);
      setEditCategoryId(response.data.expense_category_id);
      setEditDescription(response.data.description);
      setEditAmount(Number(response.data.amount));

      console.log("Data pengeluaran untuk edit:", response.data.date);
      setExpenseDate(formatDateToDateIndo(response.data.date));
    } catch (error) {
      console.error("Gagal memuat data pengeluaran untuk edit:", error);
    }
  };

  useEffect(() => {
    if (idExpense && show) {
      fetchDataForEdit(idExpense);
    }
  }, [idExpense, show]);

  const amountChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setEditAmount(isNaN(value) ? 0 : value);
  };

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setEditDescription(value);
    };

  const onSubmit = async () => {
    try {
      const unitData = {
        outlet_id: editOutletId,
        expense_category_id: editCategoryId,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: Number(editAmount),
        description: editDescription,
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
          value={editOutletId}
          onChange={setEditOutletId}
          placeholder="Pilih Outlet"
          label="OutletId"
        />

        <GenosSearchSelectExpenseCategory
          value={editCategoryId}
          onChange={setEditCategoryId}
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
          id="edit-amount-expense"
          label="Jumlah Pengeluaran"
          placeholder="Masukkan Jumlah Pengeluaran"
          type="number"
          value={editAmount}
          onKeyDown={amountChange}
          ref={inputRef}
        />

        <GenosTextarea
          label="Deskripsi"
          placeholder="Masukkan Deskripsi"
          value={editDescription}
          onKeyDown={descriptionChange}
          ref={ref}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </div>
    </GenosModal>
  );
}
