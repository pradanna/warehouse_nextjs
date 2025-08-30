"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { createSupplier } from "@/lib/api/supplierApi";
import { toast } from "react-toastify";

type AddSuppliertModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddSupplierModal({
  show,
  onClose,
  onSuccess,
}: AddSuppliertModalProps) {
  const [loading, isLoading] = useState(false);
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addContact, setAddContact] = useState("");
  const inputRefName: RefObject<HTMLInputElement> = useRef(null);
  const inputRefAddress: RefObject<HTMLInputElement> = useRef(null);
  const inputRefContact: RefObject<HTMLInputElement> = useRef(null);

  const handleSubmit = async () => {
    isLoading(true);
    try {
      const response = await createSupplier(addName, addAddress, addContact);
      setAddName("");
      setAddAddress("");
      setAddContact("");
      onSuccess();
      toast.success(response.data.message || "Supplier berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRefName.current?.focus();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Gagal menambahkan supplier";
      toast.error(message, { autoClose: 1000 });
    } finally {
      isLoading(false);
    }
  };

  return (
    <GenosModal
      title="Tambah Supplier"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={loading}
      show
      size="md"
    >
      <GenosTextfield
        id="nama-supplier"
        label="Nama Supplier"
        placeholder="Masukkan Nama Supplier"
        value={addName}
        onChange={(e) => setAddName(e.target.value)}
        ref={inputRefName}
        className="mb-3"
      />
      <GenosTextfield
        id="alamat-supplier"
        label="Alamat"
        placeholder="Masukkan Alamat"
        value={addAddress}
        onChange={(e) => setAddAddress(e.target.value)}
        ref={inputRefAddress}
        className="mb-3"
      />
      <GenosTextfield
        id="kontak-supplier"
        label="Kontak"
        placeholder="Masukkan Nomor Kontak"
        value={addContact}
        onChange={(e) => setAddContact(e.target.value)}
        ref={inputRefContact}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
    </GenosModal>
  );
}
