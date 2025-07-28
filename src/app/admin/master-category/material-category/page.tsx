"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import MaterialCategoryTable from "@/components/table/materialCategory/MaterialCategoryTable";

import React from "react";

export default function ExpenseCategory() {
  return (
    <GenosPanel
      title="Kategori Bahan Baku"
      subtitle="Data Kategori Bahan Baku"
      className="mt-3"
    >
      <MaterialCategoryTable />
    </GenosPanel>
  );
}
