"use client";
import GenosPanel from "@/components/panel/GenosPanel";
import PiutangTable from "@/components/table/piutang/piutangTable";

export default function PiutangPage() {
  return (
    <div>
      <GenosPanel
        title="Data Piutang"
        subtitle="Daftar data Piutang dari Outlet"
        className="mt-3"
      >
        <PiutangTable />
      </GenosPanel>
    </div>
  );
}
