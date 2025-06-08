"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";

type AddInventorytModalProps = {
  show: boolean;
  items: { id: string; name: string }[];
  units: { id: string; name: string }[];
  outlets: { id: string; name: string; address: string }[];
  addItemId: string | number;
  setAddItemId: (id: string | number) => void;
  addUnitId: string | number;
  setAddUnitId: (id: string | number) => void;
  addSku: string;
  setAddSku: (sku: string) => void;
  addDescription: string;
  setAddDescription: (description: string) => void;
  addCurrentStock: number;
  setAddCurrentStock: (currentStock: number) => void;
  addMinStock: number;
  setAddMinStock: (minStock: number) => void;
  addMaxStock: number;
  setAddMaxStock: (maxStock: number) => void;
  outletPrices: { [outletId: string]: number };
  setOutletPrices: (outletPrices: { [outletId: string]: number }) => void;
  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function AddInventoryModal({
  show,
  items,
  units,
  outlets,
  addItemId,
  setAddItemId,
  addUnitId,
  setAddUnitId,
  addSku,
  setAddSku,
  addDescription,
  setAddDescription,
  addCurrentStock,
  setAddCurrentStock,
  addMinStock,
  setAddMinStock,
  addMaxStock,
  setAddMaxStock,
  outletPrices,
  setOutletPrices,
  onClose,
  onSubmit,
  onKeyDown,
}: AddInventorytModalProps) {
  return (
    <GenosModal
      title="Tambah Inventory"
      onClose={onClose}
      onSubmit={onSubmit}
      show
      size="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom 1: Form utama (6/12) */}
        <div className="lg:col-span-6">
          <GenosSearchSelect
            label="Item"
            options={items.map((i) => ({ value: i.id, label: i.name }))}
            value={addItemId}
            onChange={setAddItemId}
            placeholder="Pilih item"
            className="mb-3"
          />
          <GenosSearchSelect
            label="Unit"
            options={units.map((u) => ({ value: u.id, label: u.name }))}
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
        </div>
      </div>
    </GenosModal>
  );
}
