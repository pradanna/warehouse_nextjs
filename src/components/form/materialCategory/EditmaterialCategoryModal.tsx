"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type EditMaterialCategoryModalProps = {
  show: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function EditMaterialCategoryModal({
  show,
  editValue,
  setEditValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: EditMaterialCategoryModalProps) {
  return (
    <GenosModal
      title="Tambah kategori Pengeluaran"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="edit-materialCategory"
        label="Nama Kategori Material"
        placeholder="Masukkan Nama Kategori Material"
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
