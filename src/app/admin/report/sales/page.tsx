"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import CategoryTable from "@/components/table/category/CategoryTable";
import SaleTableReport from "@/components/table/sale/SaleTableReport";
import React from "react";

export default function CurrentStockPage() {
  return (
    <div>
      <GenosPanel
        title="Sales Report"
        subtitle="Daftar data Penjualan"
        className="mt-3"
      >
        <SaleTableReport />
      </GenosPanel>
    </div>
  );
}
