"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import ExpensesOutletTable from "@/components/table/expenseOutlet/ExpensesOutletTable";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function OutletExpense() {
  console.log(getToken());
  return (
    <GenosPanel
      title="Kategori Pengeluaran"
      subtitle="Data Kategori Pengeluaran"
      className="mt-3"
    >
      <ExpensesOutletTable />
    </GenosPanel>
  );
}
