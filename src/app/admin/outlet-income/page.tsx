"use client";

import { getToken } from "@/app/config/config";
import GenosPanel from "@/components/panel/GenosPanel";
import IncomesOutletTable from "@/components/table/incomeOutlet/incomeOutletTable";
import OutletTabs from "@/components/tabs/OutletTab";
import React, { useState } from "react";

export default function OutletIncome() {
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
        title="Pemasukan Outlet"
        subtitle="Data Pemasukan Outlet"
        className="mt-3"
      >
        <IncomesOutletTable
          outletId={selectedOutletId}
          outletName={selectedOutletName}
        />
      </GenosPanel>
    </div>
  );
}
