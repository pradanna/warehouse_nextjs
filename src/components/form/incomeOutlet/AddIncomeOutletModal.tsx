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
  const [addCashAmount, setAddCashAmount] = useState<number>(0);
  const [addDigitalAmount, setAddDigitalAmount] = useState<number>(0);
  const [addMutationAmount, setAddMutationAmount] = useState<number>(0);

  const inputRefCash = useRef<HTMLInputElement>(null);
  const inputRefDigital = useRef<HTMLInputElement>(null);
  const inputRefMutation = useRef<HTMLInputElement>(null);
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [addAmount, setAddAmount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async () => {
    try {
      if (!idOutlet || !incomeDate) {
        toast.error("Outlet dan tanggal harus diisi");
        return;
      }

      const payload = {
        outlet_id: idOutlet,
        date: incomeDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        income: {
          cash: addCashAmount,
          digital: addDigitalAmount,
          by_mutation: addMutationAmount,
        },
      };

      const response = await createIncomesOutlet(payload); // ganti `createIncome` dengan fungsi API-mu
      console.log("Berhasil menambahkan data:", response);

      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err: any) {
      console.error("Gagal menambahkan data:", err);
      toast.error(err.message || "Data Gagal ditambahkan", {
        autoClose: 1000,
      });
    }
  };

  return (
    <GenosModal
      title={`Tambah Pemasukan di Outlet ` + NameOutlet}
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
          id="cash"
          label="Jumlah Pemasukan Tunai"
          placeholder="Masukkan Jumlah Pemasukan Tunai"
          type="number"
          value={addCashAmount}
          ref={inputRefCash}
          onChange={(e) => setAddCashAmount(Number(e.target.value))}
        />

        <GenosTextfield
          id="digital"
          label="Jumlah Pemasukan Digital"
          placeholder="Masukkan Jumlah Pemasukan Digital"
          type="number"
          value={addDigitalAmount}
          ref={inputRefDigital}
          onChange={(e) => setAddDigitalAmount(Number(e.target.value))}
        />

        <GenosTextfield
          id="by_mutation"
          label="Jumlah Pemasukan via Mutasi"
          placeholder="Masukkan Jumlah Pemasukan via Mutasi"
          type="number"
          value={addMutationAmount}
          ref={inputRefMutation}
          onChange={(e) => setAddMutationAmount(Number(e.target.value))}
        />
      </div>
    </GenosModal>
  );
}
