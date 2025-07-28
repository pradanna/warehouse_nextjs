"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosSearchSelectMaterialCategory from "@/components/select-search/MaterialCategorySearch";
import GenosSearchSelectCategory from "@/components/select-search/CategorySearch";
import { getItemById, updateItem } from "@/lib/api/itemApi";
import { toast } from "react-toastify";

type EditCategorytModalProps = {
  show: boolean;
  itemId: string;
  onClose: () => void;
};

export default function EdititemModal({
  show,
  itemId,
  onClose,
}: EditCategorytModalProps) {
  const [editmaterialCategory, setEditmaterialCategory] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (itemId) {
      fetchDataForEdit(itemId);
    }
  }, [itemId]);

  const fetchDataForEdit = async (id: string) => {
    try {
      const response = await getItemById(id);
      if (!response) return;

      const data = response.data;

      setEditCategoryId(data.category?.id || "");
      setEditmaterialCategory(data.material_category?.id || "");
      setEditName(data.name || "");
      setEditDescription(data.description || "");

      // Set nilai input secara langsung jika diperlukan
      if (inputRefName.current) inputRefName.current.value = data.name || "";
      if (inputRefDescription.current)
        inputRefDescription.current.value = data.description || "";
    } catch (error) {
      console.error("Gagal memuat data item untuk edit:", error);
    }
  };

  const onSubmit = async () => {
    if (!editCategoryId) {
      toast.error("Kategori harus dipilih", { autoClose: 1500 });
      return;
    }
    if (!editmaterialCategory) {
      toast.error("Bahan Baku harus dipilih", { autoClose: 1500 });
      return;
    }
    try {
      const res = await updateItem(
        itemId,
        editCategoryId,
        editmaterialCategory,
        editName,
        editDescription
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
        value={editmaterialCategory}
        onChange={(val) => setEditmaterialCategory(val as string)}
        placeholder="Pilih Kategori Bahan Baku"
      />

      <GenosSearchSelectCategory
        label="Kategori"
        value={editCategoryId}
        onChange={(val) => setEditCategoryId(val as string)}
        placeholder="Pilih kategori"
      />

      <GenosTextfield
        id="tambah-item"
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
