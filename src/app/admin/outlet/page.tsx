"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletTable from "@/components/table/OutletTable";

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
