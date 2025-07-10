"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import OutletTable from "@/components/table/outlet/OutletTable";

export default function PaymentsPage() {
  return (
    <div>
      <GenosPanel
        title="Data Outlet"
        subtitle="Daftar data outlet"
        className="mt-3"
      >
        <OutletTable />
      </GenosPanel>
    </div>
  );
}
