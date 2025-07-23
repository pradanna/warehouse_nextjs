"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type EditExpensesCategoryModalProps = {
  show: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function EditExpensesCategoryModal({
  show,
  editValue,
  setEditValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: EditExpensesCategoryModalProps) {
  return (
    <GenosModal
      title="Edit kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="edit-expensesCategory"
        label="Nama kategori Pengeluaran"
        placeholder="Masukkan Nama kategori Pengeluaran"
        value={editValue}
        onChange={(e: { target: { value: string } }) =>
          setEditValue(e.target.value)
        }
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
