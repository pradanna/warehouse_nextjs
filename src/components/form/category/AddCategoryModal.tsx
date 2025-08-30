"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import { createCategory } from "@/lib/api/categoryApi";
import { toast } from "react-toastify";

type AddItemtModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddCategoryModal({
  show,
  onClose,
  onSuccess,
}: AddItemtModalProps) {
  const [loading, setLoading] = useState(false);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefDeskripsi = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createCategory(addName, addDescription);

      setAddName("");
      setAddDescription("");
      onSuccess();
      toast.success(response.data.message || "Kategori berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRef.current?.focus();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Gagal menambahkan kategori";
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <GenosModal
      title="Tambah Kategori"
      onClose={onClose}
      onSubmit={handleSubmit}
      show
      size="md"
      isLoading={loading}
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
        onKeyDown={handleKeyDown}
        ref={inputRefDeskripsi}
        onChange={(e) => setAddDescription(e.target.value)}
      />
    </GenosModal>
  );
}
