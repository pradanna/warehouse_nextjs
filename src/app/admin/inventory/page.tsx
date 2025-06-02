"use client";

import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import UnitTable from "@/components/table/unit/UnitTable";
import React from "react";
import OutletPage from "../master-data/Outlet";
import OutletTable from "@/components/table/OutletTable";
import ItemTable from "@/components/table/ItemTable";
import InventoryTable from "@/components/table/InventoryTable";
import { CardCategory } from "@/components/card/CardCategory";

export default function InventoryPage() {
  const categorySummary = [
    { name: "Milk", total: 25 },
    { name: "Sugar", total: 12 },
    { name: "Tea", total: 9 },
    { name: "Beans", total: 9 },
    // ...
  ];

  return (
    <div>
      <CardCategory
        categories={categorySummary}
        // selectedCategory={filter.category}
        // onClick={(name) => setFilter({ ...filter, category: name })}
      />

      <GenosPanel
        title="Data Inentory"
        subtitle="Daftar data Inentory"
        className="mt-3"
      >
        <InventoryTable />
      </GenosPanel>
    </div>
  );
}
