"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletPage from "../master-data/Outlet";
import OutletTable from "@/components/table/outlet/OutletTable";
import ItemTable from "@/components/table/item/ItemTable";
import InventoryTable from "@/components/table/inventory/InventoryTable";
import PurchaseTable from "@/components/table/purchase/PurchaseTable";

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
