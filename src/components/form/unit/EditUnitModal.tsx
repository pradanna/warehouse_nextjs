"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { getUnitbyId, updateUnit } from "@/lib/api/unitApi";
import { toast } from "react-toastify";

type EditUnitModalProps = {
  show: boolean;
  id: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUnitModal({
  show,
  onClose,
  onSuccess,
  id,
}: EditUnitModalProps) {
  const [unitName, setUnitName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getDataUnit = async () => {
    try {
      const response = await getUnitbyId(id);
      setUnitName(response.data.name);

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data unit untuk edit:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateUnit(id, unitName);

      setUnitName("");
      onSuccess();
      inputRef.current?.focus();
      toast.success(response?.message || "Data berhasil ditambahkan", {
        autoClose: 1000,
      });
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (show) {
      getDataUnit();
    }
  }, [show]);

  return (
    <GenosModal
      title="Edit Unit"
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      size="md"
      isLoading={loading}
    >
      <GenosTextfield
        id="edit-unit"
        label="Nama Unit"
        placeholder="Masukkan Nama Unit"
        value={unitName}
        onChange={(e: { target: { value: string } }) =>
          setUnitName(e.target.value)
        }
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
