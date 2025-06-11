"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import SaleTable from "@/components/table/sale/SaleTable";

export default function SalesPage() {
  return (
    <div>
      <GenosPanel
        title="Data Sales"
        subtitle="Daftar data Sales"
        className="mt-3"
      >
        <SaleTable />
      </GenosPanel>
    </div>
  );
}
