"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import InventoryTable from "@/components/table/inventory/InventoryTable";

export default function InventoryPage() {
  return (
    <div>
      <GenosPanel
        title="Data Inventory"
        subtitle="Daftar data Inventory"
        className="mt-3"
      >
        <InventoryTable />
      </GenosPanel>
    </div>
  );
}
