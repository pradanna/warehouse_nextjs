"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import CategoryTable from "@/components/table/category/CategoryTable";
import InventoryTable from "@/components/table/inventory/InventoryTable";
import MovementTableReport from "@/components/table/inventory/MovementTable";
import React from "react";

export default function Stock_Adjustment_HistoryPage() {
  return (
    <div>
      <GenosPanel
        title="Data Card Stock"
        subtitle="Daftar keluar masuk stock"
        className="mt-3"
      >
        <MovementTableReport />
      </GenosPanel>
    </div>
  );
}
