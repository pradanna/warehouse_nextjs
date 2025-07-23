"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type AddExpensesCategoryModalProps = {
  show: boolean;
  addValue: string;
  setAddValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function AddExpensesCategoryModal({
  show,
  addValue,
  setAddValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: AddExpensesCategoryModalProps) {
  return (
    <GenosModal
      title="Tambah kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="tambah-expensesCategory"
        label="Nama Kategory Pengeluaran"
        placeholder="Masukkan Nama Kategory Untuk Pengeluaran"
        value={addValue}
        onChange={(e: { target: { value: string } }) =>
          setAddValue(e.target.value)
        }
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
