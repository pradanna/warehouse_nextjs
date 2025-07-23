"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import ExpensesCategoryTable from "@/components/table/expensesCategory/ExpensesCategoryTable";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ExpenseCategory() {
  return (
    <GenosPanel
      title="Kategori Pengeluaran"
      subtitle="Data Kategori Pengeluaran"
      className="mt-3"
    >
      <ExpensesCategoryTable />
    </GenosPanel>
  );
}
