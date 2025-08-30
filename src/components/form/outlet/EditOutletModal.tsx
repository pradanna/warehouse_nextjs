"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { toast } from "react-toastify";
import { getOutletById, updateOutlet } from "@/lib/api/outletApi";

type EditOutlettModalProps = {
  show: boolean;
  editId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditOutletModal({
  show,
  editId,
  onClose,
  onSuccess,
}: EditOutlettModalProps) {
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editContact, setEditContact] = useState("");
  const inputEditRefName = useRef<HTMLInputElement>(null);
  const inputEditRefAddress = useRef<HTMLInputElement>(null);
  const inputEditRefContact = useRef<HTMLInputElement>(null);

  const handleSubmitEdit = async () => {
    try {
      const response = await updateOutlet(
        editId,
        editName,
        editAddress,
        editContact
      );
      onSuccess();
      toast.success(response.data.message || "Outlet berhasil diperbarui", {
        autoClose: 1000,
      });
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah outlet";
      toast.error(message, { autoClose: 1000 });
    }
  };

  const handleEdit = async () => {
    try {
      const response = await getOutletById(editId);
      const { name, address, contact } = response.data;
      setEditName(name);
      setEditAddress(address);
      setEditContact(contact);

      setTimeout(() => {
        inputEditRefName.current?.focus();
        inputEditRefName.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data outlet:", err);
    }
  };

  useEffect(() => {
    if (show) {
      handleEdit();
    }
  }, [show]);

  return (
    <GenosModal
      title="Edit Outlet"
      onClose={onClose}
      onSubmit={handleSubmitEdit}
      show
      size="md"
    >
      <GenosTextfield
        id="edit-nama-outlet"
        label="Nama Outlet"
        placeholder="Masukkan Nama Outlet"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        ref={inputEditRefName}
        className="mb-3"
      />
      <GenosTextfield
        id="edit-alamat"
        label="Alamat"
        placeholder="Masukkan Alamat"
        value={editAddress}
        onChange={(e) => setEditAddress(e.target.value)}
        ref={inputEditRefAddress}
        className="mb-3"
      />
      <GenosTextfield
        id="edit-kontak"
        label="Kontak"
        placeholder="Masukkan Nomor Kontak"
        value={editContact}
        onChange={(e) => setEditContact(e.target.value)}
        ref={inputEditRefContact}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmitEdit();
          }
        }}
      />
    </GenosModal>
  );
}
