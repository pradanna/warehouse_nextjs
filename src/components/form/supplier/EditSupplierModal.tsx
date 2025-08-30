"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { getSupplierById } from "@/lib/api/supplierApi";
import axios from "axios";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";

type EditSuppliertModalProps = {
  show: boolean;
  id: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditSupplierModal({
  show,
  id,
  onClose,
  onSuccess,
}: EditSuppliertModalProps) {
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editContact, setEditContact] = useState("");
  const inputEditRefName: RefObject<HTMLInputElement> = useRef(null);
  const inputEditRefAddress: RefObject<HTMLInputElement> = useRef(null);
  const inputEditRefContact: RefObject<HTMLInputElement> = useRef(null);

  const fetchIdSupplier = async () => {
    setLoading(true);
    try {
      const response = await getSupplierById(id);

      const { name, address, contact } = response.data;
      setEditName(name);
      setEditAddress(address);
      setEditContact(contact);

      setTimeout(() => {
        inputEditRefName.current?.focus();
        inputEditRefName.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/supplier/${id}`,
        {
          name: editName,
          address: editAddress,
          contact: editContact,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      onSuccess();
      toast.success(response.data.message || "Supplier berhasil diperbarui", {
        autoClose: 1000,
      });
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mengubah supplier";
      toast.error(message, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchIdSupplier();
    }
  }, [show]);

  return (
    <GenosModal
      title="Edit Supplier"
      onClose={onClose}
      onSubmit={handleSubmitEdit}
      isLoading={loading}
      show
      size="md"
    >
      <GenosTextfield
        id="edit-nama-supplier"
        label="Nama Supplier"
        placeholder="Masukkan Nama Supplier"
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
