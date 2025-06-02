"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletPage from "../master-data/Outlet";
import OutletTable from "@/components/table/OutletTable";
import ItemTable from "@/components/table/ItemTable";
import InventoryTable from "@/components/table/InventoryTable";
import PurchaseTable from "@/components/table/PurchaseTable";
import SaleTable from "@/components/table/SaleTable";

export default function SalesPage() {
  return (
    <div>
      <GenosPanel
        title="Data Sales"
        subtitle="Daftar data Sales"
        className="mt-3"
      >
        <SaleTable />
      </GenosPanel>
    </div>
  );
}
