"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import dayjs from "dayjs";

import { toast } from "react-toastify";
import GenosDatepicker from "../GenosDatepicker";
import GenosTextarea from "../GenosTextArea";
import { formatDateToDateIndo } from "@/lib/helper";
import { getWarehouseExpenseById } from "@/lib/api/pastryOutlet/PastryOutletApi";
import { WarehouseExpenseInput } from "@/lib/api/warehouse-expenses/inputInterface";
import { updateWarehouseExpense } from "@/lib/api/warehouse-expenses/warehouseExpensesApi";
import GenosSearchSelectExpenseCategory from "@/components/select-search/ExpenseCategorySearchOutlet";

type EditExpensesWarehouseModalProps = {
  show: boolean;
  idExpense: string;
  onClose: () => void;
};

export default function EditExpensesWarehouseModal({
  show,
  idExpense,
  onClose,
}: EditExpensesWarehouseModalProps) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string | null>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [editAmountCash, setEditAmountCash] = useState<number>(0);
  const [editAmountDigital, setEditAmountDigital] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const fetchDataForEdit = async (id: string) => {
    setIsLoadingButton(true);
    try {
      const response = await getWarehouseExpenseById(id);
      if (!response) return;

      setEditCategoryId(response.data.category.id);
      setEditDescription(response.data.description);
      setEditAmountCash(Number(response.data.amount));

      console.log("Data pengeluaran untuk edit:", response.data.date);
      setExpenseDate(formatDateToDateIndo(response.data.date));
    } catch (error) {
      console.error("Gagal memuat data pengeluaran untuk edit:", error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    if (idExpense && show) {
      fetchDataForEdit(idExpense);
    }
  }, [idExpense, show]);

  const descriptionChange =
    () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setEditDescription(value);
    };

  const onSubmit = async () => {
    setIsLoadingButton(true);
    try {
      const unitData: WarehouseExpenseInput = {
        expense_category_id: editCategoryId,
        date: dayjs(expenseDate).format("YYYY-MM-DD"),
        amount: editAmountCash,
        description: editDescription ? editDescription : "",
      };

      const response = await updateWarehouseExpense(idExpense, unitData);
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
      title={`Tambah Pengeluaran di Warehouse `}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <GenosSearchSelectExpenseCategory
          value={editCategoryId}
          onChange={setEditCategoryId}
          placeholder="Pilih Kategori Pengeluaran"
          label="Kategori Pengeluaran"
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
