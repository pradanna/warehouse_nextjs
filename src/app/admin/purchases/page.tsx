"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import PurchaseTable from "@/components/table/purchase/PurchaseTable";

export default function PurchasesPage() {
  return (
    <div>
      <GenosPanel
        title="Data Purchases"
        subtitle="Daftar data Purchases"
        className="mt-3"
      >
        <PurchaseTable />
      </GenosPanel>
    </div>
  );
}
