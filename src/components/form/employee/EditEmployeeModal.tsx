"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { toast } from "react-toastify";
import {
  fetchEmployeeById,
  updateEmployee,
} from "@/lib/api/employee/employeeApi";

type EditEmployeeModalProps = {
  show: boolean;
  id: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditEmployeeModal({
  show,
  onClose,
  onSuccess,
  id,
}: EditEmployeeModalProps) {
  const [employeeName, setEmployeeName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getDataEmployee = async () => {
    try {
      const response = await fetchEmployeeById(id);
      setEmployeeName(response.data.name);

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } catch (err) {
      console.error("Gagal mengambil data employee untuk edit:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateEmployee(id, employeeName);

      setEmployeeName("");
      onSuccess();
      inputRef.current?.focus();
      toast.success(response?.message || "Data berhasil ditambahkan", {
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

  useEffect(() => {
    if (show) {
      getDataEmployee();
    }
  }, [show]);

  return (
    <GenosModal
      title="Edit Employee"
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      size="md"
      isLoading={loading}
    >
      <GenosTextfield
        id="edit-employee"
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
