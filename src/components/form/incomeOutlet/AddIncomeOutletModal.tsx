"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosDatepicker from "../GenosDatepicker";
import { toast } from "react-toastify";
import { createIncomesOutlet } from "@/lib/api/incomeOutletApi";
import dayjs from "dayjs";

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
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [addCashAmount, setAddCashAmount] = useState<number>(0);
  const [addDigitalAmount, setAddDigitalAmount] = useState<number>(0);

  const inputRefCash = useRef<HTMLInputElement>(null);
  const inputRefDigital = useRef<HTMLInputElement>(null);
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());

  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [incomeType, setIncomeType] = useState("Omzet");
  const [name, setName] = useState("");

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      if (!idOutlet || !incomeDate) {
        toast.error("Outlet dan tanggal harus diisi");
        return;
      }

      const expensesName =
        incomeType === "Lainnya" && name.trim() !== "" ? name : null;

      const payload = {
        outlet_id: idOutlet,
        date: dayjs(incomeDate).format("YYYY-MM-DD"),
        name: expensesName,
        description: expensesName, // ikut sama
        income: {
          cash: addCashAmount,
          digital: addDigitalAmount,
        },
      };

      console.log("Payload:", payload);

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
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    setTotalAmount((addDigitalAmount ?? 0) + (addCashAmount ?? 0));
  }, [addCashAmount, addDigitalAmount]);

  return (
    <GenosModal
      title={`Tambah Pemasukan di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
      isLoading={isLoadingButton}
    >
      <div className="flex flex-col gap-5">
        <div className="fixed z-[9998]" id="root-portal"></div>

        {/* Date Picker */}
        <GenosDatepicker
          id="income-date"
          label="Tanggal"
          selected={incomeDate}
          onChange={(date) => setIncomeDate(date)}
        />

        {/* Radio Button - Jenis Pemasukan */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Jenis Pemasukan
          </label>
          <div className="flex gap-4">
            {["Omzet", "Lainnya"].map((option) => (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-1 rounded-full border cursor-pointer transition-all ${
                  incomeType === option
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-white border-gray-300 text-gray-600 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="incomeType"
                  value={option}
                  checked={incomeType === option}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="accent-blue-500"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Jika pilih Lainnya → tampilkan deskripsi */}
        {incomeType === "Lainnya" && (
          <GenosTextfield
            id="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi pemasukan"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* Input Tunai */}
        <GenosTextfield
          id="cash"
          label="Jumlah Pemasukan Tunai"
          placeholder="Masukkan Jumlah Pemasukan Tunai"
          type="number"
          value={addCashAmount}
          ref={inputRefCash}
          onChange={(e) => setAddCashAmount(Number(e.target.value))}
        />

        {/* Input Digital */}
        <GenosTextfield
          id="digital"
          label="Jumlah Pemasukan Digital"
          placeholder="Masukkan Jumlah Pemasukan Digital"
          type="number"
          value={addDigitalAmount}
          ref={inputRefDigital}
          onChange={(e) => setAddDigitalAmount(Number(e.target.value))}
        />

        {/* Total */}
        <GenosTextfield
          id="by_mutation"
          label="Jumlah"
          disabled
          placeholder="Masukkan Jumlah Pemasukan via Mutasi"
          type="number"
          value={totalAmount}
          onChange={() => {}}
        />
      </div>
    </GenosModal>
  );
}
