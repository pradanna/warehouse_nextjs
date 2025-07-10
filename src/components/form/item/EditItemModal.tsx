"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";

type EditCategorytModalProps = {
  show: boolean;
  editCategoryId: string;
  editName: string;
  editDescription: string;
  categories: any[];
  setEditName: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditCategoryId: (value: string) => void;
  inputRefName?: RefObject<HTMLInputElement>;
  inputRefDescription?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function EdititemModal({
  show,
  editName,
  editDescription,
  setEditDescription,
  setEditName,
  setEditCategoryId,
  inputRefName,
  inputRefDescription,
  categories,
  editCategoryId,
  onClose,
  onSubmit,
  onKeyDown,
}: EditCategorytModalProps) {
  return (
    <GenosModal
      title="Tambah Item"
      onClose={onClose}
      onSubmit={onSubmit}
      show
      size="md"
    >
      <GenosSearchSelect
        label="Kategori"
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        value={editCategoryId}
        onChange={(val) => setEditCategoryId(val as string)}
        placeholder="Pilih kategori"
        className="mb-3"
      />
      <GenosTextfield
        id="ubah-item"
        label="Nama Item"
        placeholder="Masukkan Nama Item"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        ref={inputRefName}
        className="mb-3"
      />
      <GenosTextfield
        id="ubah-deskripsi"
        label="Deskripsi"
        placeholder="Masukkan Deskripsi"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        ref={inputRefDescription}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
    </GenosModal>
  );
}
