"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import ExpensesOutletTable from "@/components/table/expenseOutlet/ExpensesOutletTable";
import OutletTabs from "@/components/tabs/OutletTab";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function OutletExpense() {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );
  console.log(getToken());
  return (
    <div>
      <OutletTabs
        onSelect={setSelectedOutletId}
        onSelectName={setSelectedOutletName}
      />
      <GenosPanel
        title="Pengeluaran Outlet"
        subtitle="Data Pengeluaran Outlet"
        className="mt-3"
      >
        <ExpensesOutletTable
          outletId={selectedOutletId}
          outletName={selectedOutletName}
        />
      </GenosPanel>
    </div>
  );
}
