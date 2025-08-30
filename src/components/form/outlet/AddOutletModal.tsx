"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { createOutlet } from "@/lib/api/outletApi";
import { toast } from "react-toastify";

type AddOutlettModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddOutletModal({
  show,
  onClose,
  onSuccess,
}: AddOutlettModalProps) {
  const [loading, setLoading] = useState(false);
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addContact, setAddContact] = useState("");

  const inputRefName: RefObject<HTMLInputElement> = useRef(null);
  const inputRefAddress: RefObject<HTMLInputElement> = useRef(null);
  const inputRefContact: RefObject<HTMLInputElement> = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createOutlet(addName, addAddress, addContact);
      setAddName("");
      setAddAddress("");
      setAddContact("");
      onSuccess();
      toast.success(response.data.message || "Outlet berhasil ditambahkan", {
        autoClose: 1000,
      });
      inputRefName.current?.focus();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal menambahkan outlet";
      toast.error(message, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };
  return (
    <GenosModal
      title="Tambah Outlet"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={loading}
      show
      size="md"
    >
      <GenosTextfield
        id="tambah-nama-outlet"
        label="Nama Outlet"
        placeholder="Masukkan Nama Outlet"
        value={addName}
        onChange={(e) => setAddName(e.target.value)}
        ref={inputRefName}
        className="mb-3"
      />
      <GenosTextfield
        id="tambah-alamat"
        label="Alamat"
        placeholder="Masukkan Alamat"
        value={addAddress}
        onChange={(e) => setAddAddress(e.target.value)}
        ref={inputRefAddress}
        className="mb-3"
      />
      <GenosTextfield
        id="tambah-kontak"
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
