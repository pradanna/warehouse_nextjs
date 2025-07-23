"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import MaterialCategoryTable from "@/components/table/materialCategory/MaterialCategoryTable";

import React from "react";

export default function ExpenseCategory() {
  return (
    <GenosPanel
      title="Kategori Material"
      subtitle="Data Kategori Material"
      className="mt-3"
    >
      <MaterialCategoryTable />
    </GenosPanel>
  );
}
