"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";

type EditSuppliertModalProps = {
  show: boolean;
  editName: string;
  editAddress: string;
  editContact: string;
  ref?: RefObject<HTMLTextAreaElement>;
  setEditName: (value: string) => void;
  setEditAddress: (value: string) => void;
  setEditContact: (value: string) => void;
  inputEditRefName?: RefObject<HTMLInputElement>;
  inputEditRefAddress?: RefObject<HTMLInputElement>;
  inputEditRefContact?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function EditSupplierModal({
  show,
  editName,
  setEditAddress,
  setEditContact,
  setEditName,
  editAddress,
  editContact,
  inputEditRefName,
  inputEditRefAddress,
  inputEditRefContact,
  onClose,
  onSubmit,
  onKeyDown,
}: EditSuppliertModalProps) {
  return (
    <GenosModal
      title="Edit Supplier"
      onClose={onClose}
      onSubmit={onSubmit}
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
            onSubmit();
          }
        }}
      />
    </GenosModal>
  );
}
