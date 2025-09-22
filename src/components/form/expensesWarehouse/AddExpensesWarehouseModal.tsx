"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosDatepicker from "../GenosDatepicker";
import GenosTextarea from "../GenosTextArea";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { createWarehouseExpense } from "@/lib/api/warehouse-expenses/warehouseExpensesApi";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";
import { WarehouseExpenseInput } from "@/lib/api/warehouse-expenses/inputInterface";

type AddExpensesWarehouseModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function AddExpensesWarehouseModal({
  show,
  onClose,
}: AddExpensesWarehouseModalProps) {
  const [addCategoryId, setAddCategoryId] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [addAmountCash, setAddAmountCash] = useState<number>(0);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setAddDescription(value);
    };

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      const unitData: WarehouseExpenseInput = {
        expense_category_id: addCategoryId,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: addAmountCash,
        description: addDescription,
      };

      const response = await createWarehouseExpense(unitData);
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
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <GenosModal
      title={`Tambah Pengeluaran di Warehouse `}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="md"
    >
      <div className="flex flex-col gap-5">
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
          label="Cash"
          type="number"
          value={addAmountCash}
          ref={inputRef}
          onChange={(e) => setAddAmountCash(Number(e.target.value))}
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
