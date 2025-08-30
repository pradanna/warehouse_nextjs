"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import { createInventory } from "@/lib/api/inventory/inventoryApi";
import { toast } from "react-toastify";
import GenosSearchSelectItem from "@/components/select-search/ItemSearch";
import GenosSearchSelectUnit from "@/components/select-search/UnitSearch";
import { getOutlet } from "@/lib/api/outletApi";

type AddInventorytModalProps = {
  show: boolean;

  onClose: () => void;
  onSuccess: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function AddInventorpModal({
  show,
  onClose,
  onSuccess,
}: AddInventorytModalProps) {
  const [addItemId, setAddItemId] = useState("");
  const [addUnitId, setAddUnitId] = useState("");
  const [addSku, setAddSku] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addCurrentStock, setAddCurrentStock] = useState(0);
  const [addMinStock, setAddMinStock] = useState(0);
  const [addMaxStock, setAddMaxStock] = useState(0);
  const [outletPrices, setOutletPrices] = useState({});
  const [outlets, setOutlets] = useState<any[]>([]);
  const [isLoadingOutlet, setIsLoadingOutlet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOutlet = async (page = 1) => {
    setIsLoadingOutlet(true);
    try {
      const response = await getOutlet("", 1, 1000);

      setOutlets(response.data);
    } catch (err) {
      console.error("Gagal mengambil outlet:", err);
    } finally {
      setIsLoadingOutlet(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await createInventory(
        addItemId,
        addUnitId,
        addSku,
        addDescription,
        addMinStock,
        addMaxStock,
        outletPrices
      );

      console.log(res);
      onSuccess();
      onClose();

      toast.success("Berhasil menambahkan inventory");
    } catch (err) {
      console.error("Gagal menambahkan inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlet();
  }, []);

  return (
    <GenosModal
      title="Tambah Inventory"
      onClose={onClose}
      onSubmit={handleSubmit}
      show
      size="xl"
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom 1: Form utama (6/12) */}
        <div className="lg:col-span-6">
          <GenosSearchSelectItem
            label="Item"
            value={addItemId}
            onChange={(option) => setAddItemId(option.value)}
            placeholder="Pilih item"
          />
          <GenosSearchSelectUnit
            label="Unit"
            value={addUnitId}
            onChange={setAddUnitId}
            placeholder="Pilih unit"
            className="mb-3"
          />
          <GenosTextfield
            id="tambah-sku"
            label="SKU"
            value={addSku}
            onChange={(e) => setAddSku(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            id="tambah-deskripsi"
            label="Deskripsi"
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            id="tambah-stok"
            label="Stok Saat Ini"
            type="number"
            value={addCurrentStock.toString()}
            onChange={(e) => setAddCurrentStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            id="tambah-stok-min"
            label="Stok Minimum"
            type="number"
            value={addMinStock.toString()}
            onChange={(e) => setAddMinStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            id="tambah-stok-max"
            label="Stok Maksimum"
            type="number"
            value={addMaxStock.toString()}
            onChange={(e) => setAddMaxStock(Number(e.target.value))}
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
                        <div className="text-xs text-gray-500 mb-2">
                          {outlet.address}
                        </div>
                        <GenosTextfield
                          id={(
                            "tambah-harga-" + outletPrices[outlet.id] || ""
                          ).toString()}
                          label="Harga"
                          type="number"
                          value={(outletPrices[outlet.id] || "").toString()}
                          onChange={(e) => {
                            const updated = {
                              ...outletPrices,
                              [outlet.id]: Number(e.target.value),
                            };
                            setOutletPrices(updated);
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
