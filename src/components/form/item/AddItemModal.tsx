"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosSearchSelectMaterialCategory from "@/components/select-search/MaterialCategorySearch";
import GenosSearchSelectCategory from "@/components/select-search/CategorySearch";
import { toast } from "react-toastify";
import { createItem } from "@/lib/api/itemApi";

type AddCategorytModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function AddItemModal({
  show,
  onClose,
}: AddCategorytModalProps) {
  const [addmaterialCategory, setAddmaterialCategory] = useState<string>("");
  const [addCategoryId, setAddCategoryId] = useState<string>("");
  const [addName, setAddName] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string>("");
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    if (!addCategoryId) {
      toast.error("Kategori harus dipilih", { autoClose: 1500 });
      return;
    }
    if (!addmaterialCategory) {
      toast.error("Bahan Baku harus dipilih", { autoClose: 1500 });
      return;
    }
    try {
      const res = await createItem(
        addCategoryId,
        addmaterialCategory,
        addName,
        addDescription
      );
      toast.success(res.data.message || "Item berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal menambahkan item";
      toast.error(message, { autoClose: 1000 });
    }
  };

  return (
    <GenosModal
      title="Tambah Item"
      onClose={onClose}
      onSubmit={onSubmit}
      show
      size="md"
    >
      <GenosSearchSelectMaterialCategory
        label="Kategori Bahan Baku"
        value={addmaterialCategory}
        onChange={(val) => setAddmaterialCategory(val as string)}
        placeholder="Pilih Kategori Bahan Baku"
      />

      <GenosSearchSelectCategory
        label="Kategori"
        value={addCategoryId}
        onChange={(val) => setAddCategoryId(val as string)}
        placeholder="Pilih kategori"
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
