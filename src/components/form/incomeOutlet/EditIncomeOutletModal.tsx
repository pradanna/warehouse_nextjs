"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import dayjs from "dayjs";

import { toast } from "react-toastify";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosDatepicker from "../GenosDatepicker";
import GenosTextarea from "../GenosTextArea";
import { formatDateToDateIndo } from "@/lib/helper";
import {
  createIncomesOutlet,
  getIncomesOutletbyId,
} from "@/lib/api/incomeOutletApi";

type EditIncomeOutletModalProps = {
  show: boolean;
  idOutlet: string;
  NameOutlet: string;
  idIncome: string;
  onClose: () => void;
};

export default function EditIncomeOutletModal({
  show,
  idIncome,
  idOutlet,
  NameOutlet,
  onClose,
}: EditIncomeOutletModalProps) {
  const [editOutletId, setEditOutletId] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string | null>("");
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [editAmount, setEditAmount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const fetchDataForEdit = async (id: string) => {
    try {
      const response = await getIncomesOutletbyId(id);
      if (!response) return;

      setEditCategoryId(response.data.category.id);
      setEditDescription(response.data.description);
      setEditAmount(Number(response.data.amount));

      console.log("Data pengeluaran untuk edit:", response.data.date);
      setIncomeDate(formatDateToDateIndo(response.data.date));
    } catch (error) {
      console.error("Gagal memuat data pengeluaran untuk edit:", error);
    }
  };

  useEffect(() => {
    if (idIncome && show) {
      fetchDataForEdit(idIncome);
    }
  }, [idIncome, show]);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setEditDescription(value);
    };

  const onSubmit = async () => {
    try {
      const unitData = {
        outlet_id: idOutlet,
        income_category_id: editCategoryId,
        date: dayjs(incomeDate).format("YYYY-MM-DD"),
        amount: Number(editAmount),
        description: editDescription,
      };

      const response = await createIncomesOutlet(unitData);
      // Lakukan aksi setelah berhasil (misalnya reset form atau tutup modal)
      console.log("Berhasil menambahkan data:", response);
      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan data:", err);
      toast.error(err.message || "Data Gagal ditambahkan", {
        autoClose: 1000,
      });
    }
  };

  return (
    <GenosModal
      title={`Tambah Pengeluaran di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <div className="fixed z-[9998]" id="root-portal"></div>
        <GenosDatepicker
          id="income-date"
          label="Tanggal"
          selected={incomeDate}
          onChange={(date) => setIncomeDate(date)}
        />

        <GenosTextfield
          id="edit-amount-income"
          label="Jumlah Pengeluaran"
          placeholder="Masukkan Jumlah Pengeluaran"
          type="number"
          value={editAmount}
          ref={inputRef}
          onChange={(e) => setEditAmount(Number(e.target.value))}
        />

        <GenosTextarea
          label="Deskripsi"
          placeholder="Masukkan Deskripsi"
          value={editDescription}
          onKeyDown={descriptionChange}
          ref={ref}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </div>
    </GenosModal>
  );
}
