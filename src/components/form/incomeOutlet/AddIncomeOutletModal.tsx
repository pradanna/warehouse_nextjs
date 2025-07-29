"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosSearchSelect from "../GenosSearchSelect";
import GenosDatepicker from "../GenosDatepicker";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosTextarea from "../GenosTextArea";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { createIncomesOutlet } from "@/lib/api/incomeOutletApi";

type AddIncomeOutletModalProps = {
  idOutlet: string;
  NameOutlet: string;
  show: boolean;
  onClose: () => void;
};

export default function AddIncomeOutletModal({
  show,
  onClose,
  idOutlet,
  NameOutlet,
}: AddIncomeOutletModalProps) {
  const [addCategoryId, setAddCategoryId] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string | null>("");
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [addAmount, setAddAmount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setAddDescription(value);
    };

  const onSubmit = async () => {
    try {
      console.log("addAmount: " + addAmount.toString());
      const unitData = {
        outlet_id: idOutlet,
        income_category_id: addCategoryId,
        date: dayjs(incomeDate).format("YYYY-MM-DD"),
        amount: addAmount,
        description: addDescription,
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
          id="add-amount-income"
          label="Jumlah Pengeluaran"
          placeholder="Masukkan Jumlah Pengeluaran"
          type="number"
          value={addAmount}
          ref={inputRef}
          onChange={(e) => setAddAmount(Number(e.target.value))}
        />

        <GenosTextarea
          label="Deskripsi"
          placeholder="Masukkan Deskripsi"
          value={addDescription}
          onKeyDown={descriptionChange}
          ref={ref}
          onChange={(e) => setAddDescription(e.target.value)}
        />
      </div>
    </GenosModal>
  );
}
