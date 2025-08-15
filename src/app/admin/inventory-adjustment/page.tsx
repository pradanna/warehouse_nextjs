"use client";

import GenosDatepicker from "@/components/form/GenosDatepicker";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosPanel from "@/components/panel/GenosPanel";
import AdjustmentTableIn from "@/components/table/adjustment/AdjustmentTableIn";
import AdjustmentTableOut from "@/components/table/adjustment/AdjustmentTableOut";
import { useEffect, useState } from "react";

export default function AdjustmentPage() {
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  useEffect(() => {
    console.log("search and dateFrom and dateTo:", search + dateFrom + dateTo);
  }, [search, dateFrom, dateTo]);

  return (
    <div>
      <GenosPanel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GenosTextfield
            id="search"
            label="Search"
            placeholder="Search"
            value={search}
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
          <AdjustmentTableIn
            search={search}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </GenosPanel>

        <GenosPanel
          title="Penyesuaian Stok Keluar"
          subtitle="Daftar data Penyesuaian Stok keluar"
          className="mt-3"
        >
          <AdjustmentTableOut
            search={search}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </GenosPanel>
      </div>
    </div>
  );
}
