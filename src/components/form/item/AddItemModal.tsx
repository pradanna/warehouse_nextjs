"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";

type AddCategorytModalProps = {
  show: boolean;
  addCategoryId: string;
  addName: string;
  addDescription: string;
  categories: any[];
  setAddName: (value: string) => void;
  setAddDescription: (value: string) => void;
  setAddCategoryId: (value: string) => void;
  inputRefName?: RefObject<HTMLInputElement>;
  inputRefDescription?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function AddItemModal({
  show,
  addName,
  addDescription,
  setAddDescription,
  setAddName,
  setAddCategoryId,
  inputRefName,
  inputRefDescription,
  categories,
  addCategoryId,
  onClose,
  onSubmit,
  onKeyDown,
}: AddCategorytModalProps) {
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
        value={addCategoryId}
        onChange={(val) => setAddCategoryId(val as string)}
        placeholder="Pilih kategori"
        className="mb-3"
      />
      <GenosTextfield
        id="tambah-item"
        label="Nama Item"
        placeholder="Masukkan Nama Item"
        value={addName}
        onChange={(e) => setAddName(e.target.value)}
        ref={inputRefName}
        className="mb-3"
      />
      <GenosTextfield
        id="tambah-deskripsi"
        label="Deskripsi"
        placeholder="Masukkan Deskripsi"
        value={addDescription}
        onChange={(e) => setAddDescription(e.target.value)}
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
