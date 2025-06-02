"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";

export default function UnitPage() {
  return (
    <div>
      <GenosPanel
        title="Data Unit"
        subtitle="Daftar data unit"
        className="mt-3"
      >
        <UnitTable />
      </GenosPanel>
    </div>
  );
}
