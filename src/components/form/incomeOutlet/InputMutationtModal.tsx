"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import dayjs from "dayjs";

import { toast } from "react-toastify";
import GenosDatepicker from "../GenosDatepicker";
import { formatDateToDateIndo, formatRupiah } from "@/lib/helper";
import {
  createIncomesOutlet,
  getIncomesOutletbyId,
  updateIncomeMutation,
  updateIncomesOutlet,
} from "@/lib/api/incomeOutletApi";

type InputMutationtModalModalProps = {
  show: boolean;
  NameOutlet: string;
  idIncome: string;
  onClose: () => void;
};

export default function InputMutationtModalModal({
  show,
  idIncome,
  NameOutlet,
  onClose,
}: InputMutationtModalModalProps) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [mutationAmount, setMutationAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDataForEdit = async (id: string) => {
    setIsLoadingButton(true);
    try {
      const response = await getIncomesOutletbyId(id);
      console.log("Response:", response);
      if (!response) {
        setIsLoadingButton(false);
        return;
      }

      setTotal(response.data.total);
      setMutationAmount(response.data.by_mutation);
      setIncomeDate(
        formatDateToDateIndo(
          dayjs(response.data.date).subtract(1, "day").format("YYYY-MM-DD")
        )
      );
    } catch (error) {
      console.error("Gagal memuat data pengeluaran untuk edit:", error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    if (idIncome && show) {
      fetchDataForEdit(idIncome);
    }
  }, [idIncome, show]);

  const onSubmit = async () => {
    setIsLoadingButton(true);
    try {
      const payload = {
        date: dayjs(incomeDate).format("YYYY-MM-DD"),
        amount: mutationAmount,
      };

      const response = await updateIncomeMutation(idIncome, payload);
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
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <GenosModal
      title={`Masukan Mutasi di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      size="md"
      isLoading={isLoadingButton}
    >
      <div className="flex flex-col gap-5">
        {/* <p>Total{formatRupiah(total)}</p> */}
        <div className="fixed z-[9998]" id="root-portal"></div>
        <GenosDatepicker
          id="income-date"
          label="Tanggal"
          selected={incomeDate}
          onChange={(date) => setIncomeDate(date)}
        />

        <GenosTextfield
          id="edit-amount-income"
          label="Jumlah Mutation"
          placeholder="Masukkan Jumlah Pemasukan Cash"
          type="number"
          value={mutationAmount}
          ref={inputRef}
          onChange={(e) => setMutationAmount(Number(e.target.value))}
        />
      </div>
    </GenosModal>
  );
}
