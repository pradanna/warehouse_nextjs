"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosDatepicker from "../GenosDatepicker";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";
import GenosTextarea from "../GenosTextArea";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { OutletExpenseInput } from "@/lib/api/expensesOutletApi";
import { createPurchasesOutlet } from "@/lib/api/purchaseOutlet/PurchasesOutletApi";
import SalesPicker from "@/components/search-table/search-sale";
import { Sale } from "@/lib/api/sales/interfaceSales";
import { OutletPurchaseInput } from "@/lib/api/purchaseOutlet/PurchaseOutletInterface";

type AddPurchasesOutletModalProps = {
  idOutlet: string;
  NameOutlet: string;
  show: boolean;
  onClose: () => void;
};

export default function AddPurchasesOutletModal({
  show,
  onClose,
  idOutlet,
  NameOutlet,
}: AddPurchasesOutletModalProps) {
  const [selectedSales, setSelectedSales] = useState<Sale>();
  const [addDescription, setAddDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [addAmountCash, setAddAmountCash] = useState<number>(0);
  const [addAmountDigital, setAddAmountDigital] = useState<number>(0);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setAddDescription(value);
    };

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      const unitData: OutletPurchaseInput = {
        sale_id: selectedSales?.id,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: {
          cash: addAmountCash,
          digital: addAmountDigital,
        },
        cash_flow: {
          date: dayjs(expenseDate).format("YYYY-MM-DD"),
          name: addDescription,
        },
      };

      const response = await createPurchasesOutlet(unitData);
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
      title={`Tambah Pengeluaran di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <SalesPicker
          outlet_id={idOutlet}
          value={selectedSales}
          onSelect={(sales) => setSelectedSales(sales)}
        />

        <div className="fixed z-[9998]" id="root-portal"></div>
        <GenosDatepicker
          id="expense-date"
          label="Tanggal"
          selected={expenseDate}
          onChange={(date) => setExpenseDate(date)}
        />

        <GenosTextfield
          id="add-amount-expense"
          label="Cash"
          type="number"
          value={addAmountCash}
          ref={inputRef}
          onChange={(e) => setAddAmountCash(Number(e.target.value))}
        />

        <GenosTextfield
          id="add-amount-expense"
          label="Digital"
          type="number"
          value={addAmountDigital}
          ref={inputRef}
          onChange={(e) => setAddAmountDigital(Number(e.target.value))}
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
