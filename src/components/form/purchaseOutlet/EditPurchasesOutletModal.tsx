"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import dayjs from "dayjs";

import { toast } from "react-toastify";

import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";
import GenosDatepicker from "../GenosDatepicker";
import GenosTextarea from "../GenosTextArea";
import { formatDateToDateIndo, formatRupiah } from "@/lib/helper";
import {
  createPurchasesOutlet,
  getPurchasesOutletbyId,
  updatePurchasesOutlet,
} from "@/lib/api/purchaseOutlet/PurchasesOutletApi";

import { OutletPurchaseInput } from "@/lib/api/purchaseOutlet/PurchaseOutletInterface";
import { Sale } from "@/lib/api/sales/interfaceSales";
import { OutletPurchaseById } from "@/lib/api/purchaseOutlet/PurchaseOutletInterfaceById";
import { getSalesById } from "@/lib/api/sales/SalesApi";
import SalesPicker from "@/components/search-table/search-sale";

type EditPurchasesOutletModalProps = {
  show: boolean;
  idOutlet: string;
  NameOutlet: string;
  idPurchasse: string;
  onClose: () => void;
};

export default function EditPurchasesOutletModal({
  show,
  idPurchasse,
  idOutlet,
  NameOutlet,
  onClose,
}: EditPurchasesOutletModalProps) {
  const [selectedSales, setSelectedSales] = useState<Sale>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editDescription, setEditDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [editAmountCash, setEditAmountCash] = useState<number>(0);
  const [editAmountDigital, setEditAmountDigital] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const [idSale, setIdSale] = useState<string>("");
  const [noReference, setNoReference] = useState<string>("");
  const [dateSale, setdateSale] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  const fetchDataForEdit = async (id: string) => {
    setIsLoadingButton(true);
    try {
      const response = await getPurchasesOutletbyId(id);
      const responseSale = await getSalesById(response.data.sale.id);
      setIdSale(response.data.sale.id);
      setNoReference(response.data.sale.reference_number);
      setdateSale(responseSale.data.date);
      setTotal(response.data.sale.total);

      console.log("Data pengeluaran untuk edit:", response.data);
      if (!response) return;

      setEditDescription(response.data.cash_flow.name);
      setEditAmountCash(Number(response.data.cash));
      setEditAmountDigital(Number(response.data.digital));

      console.log("Data pengeluaran untuk edit:", response.data.date);
      setExpenseDate(formatDateToDateIndo(response.data.date));
    } catch (error) {
      console.error("Gagal memuat data pengeluaran untuk edit:", error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    if (idPurchasse && show) {
      fetchDataForEdit(idPurchasse);
    }
  }, [idPurchasse, show]);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setEditDescription(value);
    };

  const onSubmit = async () => {
    setIsLoadingButton(true);
    try {
      const unitData: OutletPurchaseInput = {
        sale_id: selectedSales?.id ?? idSale,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: {
          cash: editAmountCash,
          digital: editAmountDigital,
        },
        cash_flow: {
          date: dayjs(expenseDate).format("YYYY-MM-DD"),
          name: editDescription,
        },
      };

      const response = await updatePurchasesOutlet(idPurchasse, unitData);
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
          placeholder={
            noReference +
            " (" +
            dateSale +
            ")" +
            ", Total: " +
            formatRupiah(total)
          }
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
          id="edit-amount-expense"
          label="Cash"
          type="number"
          value={editAmountCash}
          ref={inputRef}
          onChange={(e) => setEditAmountCash(Number(e.target.value))}
        />

        <GenosTextfield
          id="edit-amount-expense"
          label="Digital"
          type="number"
          value={editAmountDigital}
          ref={inputRef}
          onChange={(e) => setEditAmountDigital(Number(e.target.value))}
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
