"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";

type EditUnitModalProps = {
  show: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function EditUnitModal({
  show,
  editValue,
  setEditValue,
  inputRef,
  onClose,
  onSubmit,
  onKeyDown,
}: EditUnitModalProps) {
  return (
    <GenosModal
      title="Edit Unit"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <GenosTextfield
        id="edit-unit"
        label="Nama Unit"
        placeholder="Masukkan Nama Unit"
        value={editValue}
        onChange={(e: { target: { value: string } }) =>
          setEditValue(e.target.value)
        }
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
