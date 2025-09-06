"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import PastrysOutletTable from "@/components/table/pastryOutlet/PastryOutletTable";
import PurchasesOutletTable from "@/components/table/purchaseOutlet/PurchasesOutletTable";
import OutletTabs from "@/components/tabs/OutletTab";
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
        title="Pastry Outlet"
        subtitle="Data Pastry Outlet"
        className="mt-3"
      >
        <PastrysOutletTable
          outletId={selectedOutletId}
          outletName={selectedOutletName}
        />
      </GenosPanel>
    </div>
  );
}
