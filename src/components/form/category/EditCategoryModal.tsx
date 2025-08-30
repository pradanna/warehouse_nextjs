"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";
import { editCategory, findCategoryById } from "@/lib/api/categoryApi";
import { toast } from "react-toastify";

type EditCategorytModalProps = {
  show: boolean;
  editCategoryId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditCategoryModal({
  show,
  editCategoryId,
  onClose,
  onSuccess,
}: EditCategorytModalProps) {
  const [loading, setLoading] = useState(false);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefDeskripsi = useRef<HTMLTextAreaElement>(null);

  const handleGetEdit = async () => {
    setLoading(true);
    try {
      const response = await findCategoryById(editCategoryId);

      const { name, description } = response.data;
      setAddName(name);
      setAddDescription(description ?? "");

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    setLoading(true);

    try {
      const response = await editCategory(
        editCategoryId,
        addName,
        addDescription
      );
      toast.success(response.data.message || "Kategori berhasil diperbarui", {
        autoClose: 1000,
      });
      onSuccess();
      setAddName("");
      setAddDescription("");
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah kategori";
      console.error("Gagal mengubah kategori:", message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitEdit();
    }
  };

  useEffect(() => {
    if (show) {
      handleGetEdit();
    }
  }, [show]);

  return (
    <GenosModal
      title="Tambah Kategori"
      onClose={onClose}
      onSubmit={handleSubmitEdit}
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
        onKeyDown={handleKeyDownEdit}
        ref={inputRefDeskripsi}
        onChange={(e) => setAddDescription(e.target.value)}
      />
    </GenosModal>
  );
}
