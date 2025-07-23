"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type AddMaterialCategoryModalProps = {
  show: boolean;
  addValue: string;
  setAddValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function AddMaterialCategoryModal({
  show,
  addValue,
  setAddValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: AddMaterialCategoryModalProps) {
  return (
    <GenosModal
      title="Tambah kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="tambah-materialCategory"
        label="Nama Kategori Material"
        placeholder="Masukkan Nama Kategori Material"
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
