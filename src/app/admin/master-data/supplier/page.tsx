"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import SupplierTable from "@/components/table/supplier/SupplierTable";

export default function SupplierPage() {
  return (
    <div>
      <GenosPanel
        title="Data Supplier"
        subtitle="Daftar data Supplier"
        className="mt-3"
      >
        <SupplierTable />
      </GenosPanel>
    </div>
  );
}
