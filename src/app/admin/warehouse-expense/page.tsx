"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import ExpensesOutletTable from "@/components/table/expenseOutlet/ExpensesOutletTable";
import ExpensesWarehouseTable from "@/components/table/warehouseExpenses/ExpensesWarehouseTable";
import OutletTabs from "@/components/tabs/OutletTab";
import React, { useState } from "react";

export default function WarehouseExpenses() {
  return (
    <div>
      <GenosPanel
        title="Pengeluaran Warehouse"
        subtitle="Data Pengeluaran Warehouse"
        className="mt-3"
      >
        <ExpensesWarehouseTable />
      </GenosPanel>
    </div>
  );
}
