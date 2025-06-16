"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import CategoryTable from "@/components/table/category/CategoryTable";
import PurchaseTableReport from "@/components/table/purchase/PurchaseTableReport";
import React from "react";

export default function CurrentStockPage() {
  return (
    <div>
      <GenosPanel
        title="Purchases Report"
        subtitle="Daftar data Pembelian"
        className="mt-3"
      >
        <PurchaseTableReport />
      </GenosPanel>
    </div>
  );
}
