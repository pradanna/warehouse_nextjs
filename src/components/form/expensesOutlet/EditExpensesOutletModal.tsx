"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type EditExpensesOutletModalProps = {
  show: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function EditExpensesOutletModal({
  show,
  editValue,
  setEditValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: EditExpensesOutletModalProps) {
  return (
    <GenosModal
      title="Edit kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="edit-expensesOutlet"
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
