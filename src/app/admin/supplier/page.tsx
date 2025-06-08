"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletPage from "../master-data/Outlet";
import OutletTable from "@/components/table/outlet/OutletTable";
import SupplierTable from "@/components/table/supplier/SupplierTable";

export default function SupplierPage() {
  return (
    <div>
      <GenosPanel
        title="Data Supplier"
        subtitle="Daftar data Supplier"
        className="mt-3"
      >
        <SupplierTable />
      </GenosPanel>
    </div>
  );
}
