"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import HutangTable from "@/components/table/hutang/hutangTable";

export default function HutangPage() {
  return (
    <div>
      <GenosPanel
        title="Data Hutang"
        subtitle="Daftar data Hutang ke Supplier"
        className="mt-3"
      >
        <HutangTable />
      </GenosPanel>
    </div>
  );
}
