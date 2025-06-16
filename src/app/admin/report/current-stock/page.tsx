"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import InventoryTableReport from "@/components/table/inventory/InventoryTableReport";
import React from "react";

export default function CurrentStockPage() {
  return (
    <div>
      <GenosPanel
        title="Stok Saat Ini"
        subtitle="Laporan Sisa Stok barang saat ini"
        className="mt-3"
      >
        <InventoryTableReport />
      </GenosPanel>
    </div>
  );
}
