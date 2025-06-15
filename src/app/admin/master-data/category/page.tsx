"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import CategoryTable from "@/components/table/category/CategoryTable";
import React from "react";

export default function CategoryPage() {
  return (
    <div>
      <GenosPanel
        title="Data Category"
        subtitle="Daftar data Category"
        className="mt-3"
      >
        <CategoryTable />
      </GenosPanel>
    </div>
  );
}
