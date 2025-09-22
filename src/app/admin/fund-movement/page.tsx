"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import ExpensesOutletTable from "@/components/table/expenseOutlet/ExpensesOutletTable";
import FundMovementTable from "@/components/table/fundMovement/fundMovementTable";
import OutletTabs from "@/components/tabs/OutletTab";
import React, { useState } from "react";

export default function FundMovement() {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );
  return (
    <div>
      <OutletTabs
        onSelect={setSelectedOutletId}
        onSelectName={setSelectedOutletName}
      />
      <GenosPanel
        title="Perpindahan Dana"
        subtitle="Data Perpindahan dana (tarik tunai atau setor tunai)"
        className="mt-3"
      >
        <FundMovementTable
          outletId={selectedOutletId}
          outletName={selectedOutletName}
        />
      </GenosPanel>
    </div>
  );
}
