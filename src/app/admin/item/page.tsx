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

export default function ItemPage() {
  return (
    <div>
      <GenosPanel
        title="Data Item"
        subtitle="Daftar data Item"
        className="mt-3"
      >
        <ItemTable />
      </GenosPanel>
    </div>
  );
}
