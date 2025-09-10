"use client";

import GenosModal from "@/components/modal/GenosModal";
import GenosTextfield from "../GenosTextfield";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { createEmployee } from "@/lib/api/employee/employeeApi";

type AddEmployeeModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddEmployeeModal({
  show,
  onClose,
  onSuccess,
}: AddEmployeeModalProps) {
  const [employeeName, setEmployeeName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createEmployee({ name: employeeName });

      setEmployeeName("");
      onSuccess();
      inputRef.current?.focus();

      toast.success("Data berhasil ditambahkan", {
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
      title="Tambah Employee"
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      size="md"
      isLoading={loading}
    >
      <GenosTextfield
        id="tambah-employee"
        label="Nama Employee"
        placeholder="Masukkan Nama Employee"
        value={employeeName}
        onChange={(e: { target: { value: string } }) =>
          setEmployeeName(e.target.value)
        }
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </GenosModal>
  );
}
