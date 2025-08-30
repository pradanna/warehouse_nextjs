"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";
import {
  getInventoryById,
  updateInventory,
} from "@/lib/api/inventory/inventoryApi";
import { toast } from "react-toastify";
import GenosSearchSelectItem from "@/components/select-search/ItemSearch";
import GenosSearchSelectUnit from "@/components/select-search/UnitSearch";
import { getOutlet } from "@/lib/api/outletApi";

type EditInventorytModalProps = {
  show: boolean;
  idInventory: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditInventoryModal({
  show,
  idInventory,
  onClose,
  onSuccess,
}: EditInventorytModalProps) {
  const [localPrices, setLocalPrices] = useState<{ [key: string]: number }>({});
  const [editItemId, setEditItemId] = useState("");
  const [editUnitId, setEditUnitId] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCurrentStock, setEditCurrentStock] = useState(0);
  const [editMinStock, setEditMinStock] = useState(0);
  const [editMaxStock, setEditMaxStock] = useState(0);

  const [outletPrices, setOutletPrices] = useState<Record<string, number>>({});
  const [outlets, setOutlets] = useState<any[]>([]);
  const [isLoadingOutlet, setIsLoadingOutlet] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const handleEdit = async () => {
    setIsLoadingOutlet(true);
    setIsLoadingButton(true);

    try {
      const resInventory = await getInventoryById(idInventory);
      const dataInventory = resInventory.data;

      const responseOutlet = await getOutlet("", 1, 1000);

      console.log("data", dataInventory);
      console.log("data.item_id", dataInventory.item.id);
      console.log("data.unit_id", dataInventory.unit.id);

      setEditItemId(dataInventory.item.id);
      setEditUnitId(dataInventory.unit.id);
      setEditSku(dataInventory.sku);
      setEditDescription(dataInventory.description ?? "");
      setEditCurrentStock(dataInventory.current_stock);
      setEditMinStock(dataInventory.min_stock);
      setEditMaxStock(dataInventory.max_stock);

      // Atur harga per outlet
      const outletPricesObj: { [key: string]: number } = {};
      dataInventory.prices?.forEach(
        (priceObj: { outlet: { id: string }; price: number }) => {
          const outletId = priceObj.outlet?.id;
          if (outletId) {
            outletPricesObj[outletId] = priceObj.price;
          } else {
            console.warn("Ditemukan harga tanpa outlet id:", priceObj);
          }
        }
      );

      // Gabungkan harga ke dalam data outlet
      const mergedOutlets = responseOutlet.data.map((outlet: any) => ({
        ...outlet,
        price: outletPricesObj[outlet.id] ?? 0, // default 0 kalau tidak ada harga
      }));

      console.log("mergedOutlets =", JSON.stringify(mergedOutlets, null, 2));

      setOutlets(mergedOutlets); // simpan outlet + harga
    } catch (err) {
      toast.error("Gagal mengambil detail inventory");
    } finally {
      setIsLoadingOutlet(false);
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    handleEdit();
  }, []);

  const handleSubmitEdit = async () => {
    setIsLoadingButton(true);

    try {
      const mergedPrices = {
        ...outletPrices, // ini akan menimpa data awal jika ada perubahan
      };

      const pricesArray = Object.entries(mergedPrices).map(
        ([outlet_id, price]) => ({
          outlet_id,
          price,
        })
      );

      console.log("PRICEARRAY OBJECT ", pricesArray);

      await updateInventory(
        idInventory,
        editItemId,
        editUnitId,
        editSku,
        editDescription ?? "",
        editCurrentStock,
        editMinStock,
        editMaxStock,
        pricesArray
      );

      onSuccess();
      onClose();
      toast.success("Berhasil mengubah inventory");
    } catch (err) {
      console.error("Gagal menambahkan inventory");
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <GenosModal
      title="Edit Inventory"
      onClose={onClose}
      onSubmit={handleSubmitEdit}
      isLoading={isLoadingButton}
      show
      size="xl"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <GenosSearchSelectItem
            label="Item"
            value={editItemId}
            onChange={(option) => setEditItemId(option.value)}
            placeholder="Pilih item"
          />
          <GenosSearchSelectUnit
            label="Unit"
            value={editUnitId}
            onChange={setEditUnitId}
            placeholder="Pilih unit"
            className="mb-3"
          />
          <GenosTextfield
            id="edit-sku"
            label="SKU"
            value={editSku}
            onChange={(e) => setEditSku(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            id="edit-deskripsi"
            label="Deskripsi"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mb-3"
          />

          <GenosTextfield
            id="edit-stok"
            label="Stok Saat Ini"
            type="number"
            value={editCurrentStock.toString()}
            onChange={(e) => setEditCurrentStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            id="edit-stok-min"
            label="Stok Minimum"
            type="number"
            value={editMinStock.toString()}
            onChange={(e) => setEditMinStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            id="edit-stok-max"
            label="Stok Maksimum"
            type="number"
            value={editMaxStock.toString()}
            onChange={(e) => setEditMaxStock(Number(e.target.value))}
          />
        </div>

        <div className="lg:col-span-6 ">
          <h3 className="text-md font-semibold mb-3">Harga per Outlet</h3>

          {isLoadingOutlet ? (
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/local/blue-loading.gif"
                alt="Loading..."
                className="w-12 h-12 mb-2"
              />
              <p className="text-center">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {[0, 1].map((groupIndex) => (
                <div
                  key={groupIndex}
                  className="lg:col-span-6 space-y-4 max-h-[520px] overflow-y-auto pr-1"
                >
                  {outlets
                    .filter((_, i) => i % 2 === groupIndex)
                    .map((outlet) => (
                      <div
                        key={outlet.id}
                        className="border border-gray-200 rounded-xl p-3"
                      >
                        <div className="text-sm font-medium">{outlet.name}</div>
                        <div className="text-xs text-gray-500 mb-3">
                          {outlet.address}
                        </div>
                        <GenosTextfield
                          id={`edit-harga-${outlet.id}`}
                          label="Harga"
                          type="number"
                          value={
                            localPrices[outlet.id]?.toString() ??
                            outlet.price?.toString() ??
                            "" // ✅ fallback ke harga dari API
                          }
                          onChange={(e) => {
                            const newPrices = {
                              ...localPrices,
                              [outlet.id]: Number(e.target.value),
                            };

                            setLocalPrices(newPrices);
                            setOutletPrices(newPrices);
                          }}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GenosModal>
  );
}
