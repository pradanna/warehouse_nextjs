"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type AddUnitModalProps = {
  show: boolean;
  addValue: string;
  setAddValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function AddUnitModal({
  show,
  addValue,
  setAddValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: AddUnitModalProps) {
  return (
    <GenosModal
      title="Tambah Unit"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="tambah-unit"
        label="Nama Unit"
        placeholder="Masukkan Nama Unit"
        value={addValue}
        onChange={(e: { target: { value: string } }) =>
          setAddValue(e.target.value)
        }
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
