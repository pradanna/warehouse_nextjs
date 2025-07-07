"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import React from "react";
import InventoryTable from "@/components/table/inventory/InventoryTable";
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
