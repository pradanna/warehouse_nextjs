"use client";

import GenosDatepicker from "@/components/form/GenosDatepicker";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import AdjustmentTableInReport from "@/components/table/adjustment/AdjustmentTableInReport";
import AdjustmentTableOutReport from "@/components/table/adjustment/AdjustmentTableOutReport";
import React, { useState } from "react";

export default function Stock_Adjustment_HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  return (
    <div>
      <GenosPanel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GenosTextfield
            id="search"
            label="Search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />

          <GenosDatepicker
            id="tanggal-dari"
            label="Dari Tanggal"
            selected={dateFrom}
            onChange={(date) => setDateFrom(date)}
          />

          <GenosDatepicker
            id="tanggal-sampai"
            label="Sampai Tanggal"
            selected={dateTo}
            onChange={(date) => setDateTo(date)}
          />
        </div>
      </GenosPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GenosPanel
          title="Penyesuaian Stok Masuk"
          subtitle="Daftar data Penyesuaian Stok Masuk"
          className="mt-3"
        >
          <AdjustmentTableInReport
            search={search}
            setSearch={setSearch}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </GenosPanel>

        <GenosPanel
          title="Penyesuaian Stok Keluar"
          subtitle="Daftar data Penyesuaian Stok keluar"
          className="mt-3"
        >
          <AdjustmentTableOutReport
            search={search}
            setSearch={setSearch}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </GenosPanel>
      </div>
    </div>
  );
}
