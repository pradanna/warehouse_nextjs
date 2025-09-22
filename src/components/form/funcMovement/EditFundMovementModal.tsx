"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosDatepicker from "../GenosDatepicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  createFundTransfer,
  findFundTransferById,
  updateFundTransfer,
} from "@/lib/api/fundMovement/fundMovementApi";
import GenosSelect from "../GenosSelect";

type EditFundTransferModalProps = {
  show: boolean;
  onClose: () => void;
  outletId: string; // wajib dari parent
  nameOutlet: string; // wajib dari parent
  idFundMovement: string;
};

export default function EditFundTransferModal({
  show,
  onClose,
  outletId,
  nameOutlet,
  idFundMovement,
}: EditFundTransferModalProps) {
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferDate, setTransferDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number>(0);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchByIdFundMovement = async (id: string) => {
    try {
      const res = await findFundTransferById(id);

      setTransferTo(res.data.transfer_to);
      setTransferDate(new Date(res.data.date));
      setAmount(res.data.amount);

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);

      console.log("Data expensesOutlet untuk edit:", res.data);
    } catch (err) {
      console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
    }
  };

  useEffect(() => {
    console.log("idFundMovement di useEffect:", idFundMovement);
    if (idFundMovement) {
      fetchByIdFundMovement(idFundMovement);
    }
  }, [idFundMovement]);

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      const transferData = {
        outlet_id: outletId,
        date: dayjs(transferDate).format("YYYY-MM-DD"),
        amount,
        transfer_to: transferTo,
      };

      const response = await updateFundTransfer(idFundMovement, transferData);
      console.log("Berhasil menambahkan fund transfer:", response);
      toast.success(response.message || "Data Berhasil ditambahkan", {
        autoClose: 1000,
      });
      onClose();
    } catch (err: any) {
      console.error("Gagal menambahkan fund transfer:", err);
      toast.error(err.message || "Data Gagal ditambahkan", {
        autoClose: 1000,
      });
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <GenosModal
      title={`Melakukan Perpindahan dana (${nameOutlet})`}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <GenosDatepicker
          id="transfer-date"
          label="Tanggal"
          selected={transferDate}
          onChange={(date) => setTransferDate(date)}
        />

        <GenosTextfield
          id="edit-amount-fund-transfer"
          label="Jumlah Transfer"
          type="number"
          value={amount}
          ref={inputRef}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <GenosSelect
          label="Jenis Tansfer"
          className="text-xs w-full"
          options={[
            { label: "PILIH SEMUA", value: "" },
            { label: "CASH TO DIGITAL", value: "digital" },
            { label: "DIGITAL TO CASH", value: "cash" },
          ]}
          value={transferTo}
          onChange={(e) => {
            console.log("Event:", e);
            console.log("Value:", e.target.value);
            setTransferTo(e.target.value);
          }}
        />
      </div>
    </GenosModal>
  );
}
