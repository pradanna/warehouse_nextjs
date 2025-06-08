"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";

type AddItemtModalProps = {
  show: boolean;
  addName: string;
  addDescription: string;
  ref?: RefObject<HTMLTextAreaElement>;
  setAddName: (value: string) => void;
  setAddDescription: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function AddCategoryModal({
  show,
  addName,
  addDescription,
  ref,
  setAddDescription,
  setAddName,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: AddItemtModalProps) {
  return (
    <GenosModal
      title="Tambah Kategori"
      onClose={onClose}
      onSubmit={onSubmit}
      show
      size="md"
    >
      <GenosTextfield
        id="tambah-nama-kategori"
        label="Nama Kategori"
        placeholder="Masukkan Nama Kategori"
        value={addName}
        onChange={(e) => setAddName(e.target.value)}
        ref={inputRef}
        className="mb-3"
      />
      <GenosTextarea
        label="Deskripsi"
        placeholder="Masukkan Deskripsi"
        value={addDescription}
        onKeyDown={onKeyDown}
        ref={ref}
        onChange={(e) => setAddDescription(e.target.value)}
      />
    </GenosModal>
  );
}
