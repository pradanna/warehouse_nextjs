"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type AddSuppliertModalProps = {
  show: boolean;
  addName: string;
  addAddress: string;
  addContact: string;
  ref?: RefObject<HTMLTextAreaElement>;
  setAddName: (value: string) => void;
  setAddAddress: (value: string) => void;
  setAddContact: (value: string) => void;
  inputRefName?: RefObject<HTMLInputElement>;
  inputRefAddress?: RefObject<HTMLInputElement>;
  inputRefContact?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function AddSupplierModal({
  show,
  addName,
  setAddAddress,
  setAddContact,
  setAddName,
  addAddress,
  addContact,
  inputRefName,
  inputRefAddress,
  inputRefContact,
  onClose,
  onSubmit,
  onKeyDown,
}: AddSuppliertModalProps) {
  return (
    <GenosModal
      title="Tambah Supplier"
      onClose={onClose}
      onSubmit={onSubmit}
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
            onSubmit();
          }
        }}
      />
    </GenosModal>
  );
}
