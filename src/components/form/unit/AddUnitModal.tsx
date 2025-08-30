"use client";

import GenosModal from "@/components/modal/GenosModal";
import GenosTextfield from "../GenosTextfield";
import { createUnit } from "@/lib/api/unitApi";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

type AddUnitModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddUnitModal({
  show,
  onClose,
  onSuccess,
}: AddUnitModalProps) {
  const [unitName, setUnitName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createUnit({ name: unitName });

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

  return (
    <GenosModal
      title="Tambah Unit"
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      size="md"
      isLoading={loading}
    >
      <GenosTextfield
        id="tambah-unit"
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
