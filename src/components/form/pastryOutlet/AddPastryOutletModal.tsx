"use client";

import GenosModal from "@/components/modal/GenosModal";
import { useMemo, useRef, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosDatepicker from "../GenosDatepicker";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { createPastrysOutlet } from "@/lib/api/pastryOutlet/PastryOutletApi";
import { OutletPastryCreate } from "@/lib/api/pastryOutlet/PastryOutletInterfaceInput";
import GenosTable from "@/components/table/GenosTable";
import { Item } from "@/lib/api/pastryOutlet/PastryOutletInterfaceById";

type AddPastrysOutletModalProps = {
  idOutlet: string;
  NameOutlet: string;
  show: boolean;
  onClose: () => void;
};

export default function AddPastrysOutletModal({
  show,
  onClose,
  idOutlet,
  NameOutlet,
}: AddPastrysOutletModalProps) {
  const [addReferenceNumber, setAddReferenceNumber] = useState<string>("");
  const [pastryDate, setPastryDate] = useState<Date>(new Date());
  const [CartPastries, setCartPastries] = useState<Item[]>([]);

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showModalItems, setShowModalItems] = useState(false);
  const [namaPastry, setNamaPastry] = useState<string>("");
  const [qtypastry, setQtyPastry] = useState<number>(0);
  const [hargaPastry, setHargaPastry] = useState<number>(0);

  const TABLE_HEAD_CART_PASTRY = [
    { key: "name", label: "Nama Items", sortable: false },
    { key: "qty", label: "Qty", type: "number", sortable: false },
    { key: "price", label: "Harga", type: "currency", sortable: false },
    { key: "total", label: "Total Harga", type: "currency", sortable: false },
  ];

  const handleOpen = () => {
    setShowModalItems(true);
  };

  const closeModalItems = () => {
    setShowModalItems(false);
  };

  const TABLE_ROW_CART_PASTRY = useMemo(() => {
    console.log("cart pastrys: ", CartPastries);
    return CartPastries.map((pastrysOutlet) => ({
      name: pastrysOutlet.name,
      qty: pastrysOutlet.quantity,
      price: pastrysOutlet.price,
      total: pastrysOutlet.price * pastrysOutlet.quantity,
    }));
  }, [CartPastries]);

  const onSubmit = async () => {
    setIsLoadingButton(true);

    try {
      const unitData: OutletPastryCreate = {
        outlet_id: idOutlet,
        date: dayjs(pastryDate).format("YYYY-MM-DD"),
        reference_number: addReferenceNumber,
        carts: CartPastries,
      };

      const response = await createPastrysOutlet(unitData);
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

  const handleDelete = (id: string) => {
    console.log("Delete ID:", id);
    console.log(
      "Before:",
      CartPastries.map((i) => i.id)
    );
    setCartPastries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <GenosModal
      title={`Tambah Pastry di Outlet ` + NameOutlet}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex-1 flex flex-col gap-5">
          <div className="fixed z-[9998]" id="root-portal"></div>
          <GenosDatepicker
            id="expense-date"
            label="Tanggal"
            selected={pastryDate}
            onChange={(date) => setPastryDate(date)}
          />

          <GenosTextfield
            id="add-reference_number"
            label="Reference Number"
            type="text"
            value={addReferenceNumber}
            ref={inputRef}
            onChange={(e) => setAddReferenceNumber(e.target.value)}
          />
        </div>

        <div className="p-4 border border-gray-300 rounded-lg">
          <GenosTable
            TABLE_HEAD={TABLE_HEAD_CART_PASTRY}
            TABLE_ROWS={TABLE_ROW_CART_PASTRY}
            onAddData={handleOpen}
            ACTION_BUTTON={{ delete: (row) => handleDelete(row.name) }}
            FILTER={
              <div>
                <p>Daftar Items</p>
              </div>
            }
          />
        </div>
      </div>

      <GenosModal
        show={showModalItems}
        onClose={closeModalItems}
        title="Tambah Item"
        onSubmit={() => {
          setCartPastries([
            ...CartPastries,
            {
              id: namaPastry,
              name: namaPastry,
              quantity: qtypastry,
              qty: qtypastry,
              price: hargaPastry,
              total: hargaPastry * qtypastry,
            },
          ]);
          setNamaPastry("");
          setQtyPastry(0);
          setHargaPastry(0);
          closeModalItems();
        }}
      >
        <div className="flex flex-col gap-5">
          <GenosTextfield
            id="nama-pastry"
            label="Nama Items"
            placeholder="Masukkan nama Pastry"
            type="text"
            value={namaPastry}
            ref={inputRef}
            onChange={(e) => setNamaPastry(e.target.value)}
          />
          <GenosTextfield
            id="qty-pastry"
            label="Jumlah"
            placeholder="Masukkan Jumlah Pastry"
            type="number"
            value={qtypastry}
            ref={inputRef}
            onChange={(e) => setQtyPastry(Number(e.target.value))}
          />
          <GenosTextfield
            id="harga-pastry"
            label="Harga"
            placeholder="Masukkan Total harga"
            type="number"
            value={hargaPastry}
            ref={inputRef}
            onChange={(e) => setHargaPastry(Number(e.target.value))}
          />

          <GenosTextfield
            id="total-harga-pastry"
            disabled
            label="Total Harga"
            placeholder="Masukkan Total harga"
            type="number"
            value={hargaPastry * qtypastry}
            ref={inputRef}
            onChange={(e) => e}
          />
        </div>
      </GenosModal>
    </GenosModal>
  );
}
