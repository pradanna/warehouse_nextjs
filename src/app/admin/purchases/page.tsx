"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletTable from "@/components/table/outlet/OutletTable";
import ItemTable from "@/components/table/item/ItemTable";
import InventoryTable from "@/components/table/inventory/InventoryTable";
import PurchaseTable from "@/components/table/purchase/PurchaseTable";

export default function PurchasesPage() {
  return (
    <div>
      <GenosPanel
        title="Data Purchases"
        subtitle="Daftar data Purchases"
        className="mt-3"
      >
        <PurchaseTable />
      </GenosPanel>
    </div>
  );
}
