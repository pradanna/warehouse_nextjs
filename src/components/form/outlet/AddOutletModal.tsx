"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";

type AddOutlettModalProps = {
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

export default function AddOutletModal({
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
}: AddOutlettModalProps) {
  return (
    <GenosModal
      title="Tambah Outlet"
      onClose={onClose}
      onSubmit={onSubmit}
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
            onSubmit();
          }
        }}
      />
    </GenosModal>
  );
}
