"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosDatepicker from "../GenosDatepicker";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";

type AddExpensesOutletModalProps = {
  show: boolean;
  addValue: string;
  setAddValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function AddExpensesOutletModal({
  show,
  addValue,
  setAddValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: AddExpensesOutletModalProps) {
  const [addOutletId, setAddOutletId] = useState<string | null>(null);
  const [addCategoryId, setAddCategoryId] = useState<string | null>(null);
  const [expenseDate, setExpenseDate] = useState<Date | null>(new Date());

  return (
    <GenosModal
      title="Tambah kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      {/* "outlet_id": "78dc1b3a-b2f5-48ec-9c33-91f719f34cf9",
      "expense_category_id": "5aa34ce9-a181-4751-9b74-846753b1ddb3", "date":
      "2025-07-16", "amount": 140000, "description": "pengeluaran" */}
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
          id="tambah-expensesOutlet"
          label="Nama Kategory Pengeluaran"
          placeholder="Masukkan Nama Kategory Untuk Pengeluaran"
          value={addValue}
          onChange={(e: { target: { value: string } }) =>
            setAddValue(e.target.value)
          }
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
      </div>
    </GenosModal>
  );
}
