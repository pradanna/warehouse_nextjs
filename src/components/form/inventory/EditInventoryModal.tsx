"use client";

import GenosModal from "@/components/modal/GenosModal";
import { RefObject, useEffect, useState } from "react";
import GenosTextfield from "../GenosTextfield";
import GenosTextarea from "../GenosTextArea";
import GenosSearchSelect from "../GenosSearchSelect";

type EditInventorytModalProps = {
  show: boolean;
  items: { id: string; name: string }[];
  units: { id: string; name: string }[];
  outlets: {
    address: string;
    id: string;
    name: string;
  }[];

  editItemId: string | number;
  setEditItemId: (id: string | number) => void;
  editUnitId: string | number;
  setEditUnitId: (id: string | number) => void;
  editSku: string;
  setEditSku: (sku: string) => void;
  editDescription: string;
  setEditDescription: (description: string) => void;
  editCurrentStock: number;
  setEditCurrentStock: (currentStock: number) => void;
  editMinStock: number;
  setEditMinStock: (minStock: number) => void;
  editMaxStock: number;
  setEditMaxStock: (maxStock: number) => void;
  outletPrices: { [outletId: string]: number };
  setOutletPrices: (outletPrices: { [outletId: string]: number }) => void;
  outletPriceObj: { [outletId: string]: number };

  onClose: () => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function EditInventoryModal({
  show,
  items,
  units,
  outlets,
  editItemId,
  setEditItemId,
  editUnitId,
  setEditUnitId,
  editSku,
  setEditSku,
  editDescription,
  setEditDescription,
  editCurrentStock,
  setEditCurrentStock,
  editMinStock,
  setEditMinStock,
  editMaxStock,
  setEditMaxStock,
  outletPrices,
  setOutletPrices,
  outletPriceObj,
  onClose,
  onSubmit,

  onKeyDown,
}: EditInventorytModalProps) {
  console.log("outletPriceObj =", JSON.stringify(outletPriceObj, null, 2));
  const [localPrices, setLocalPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setLocalPrices(outletPriceObj);
  }, [outletPriceObj]);

  return (
    <GenosModal
      title="Edit Inventory"
      onClose={onClose}
      onSubmit={onSubmit}
      show
      size="xl"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <GenosSearchSelect
            label="Item"
            options={items.map((i) => ({ value: i.id, label: i.name }))}
            value={editItemId}
            onChange={setEditItemId}
            placeholder="Pilih item"
            className="mb-3"
          />
          <GenosSearchSelect
            label="Unit"
            options={units.map((u) => ({ value: u.id, label: u.name }))}
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
                        value={localPrices[outlet.id]?.toString() || ""}
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
        </div>
      </div>
    </GenosModal>
  );
}
