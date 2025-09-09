"use client";

import GenosButton from "@/components/button/GenosButton";
// import CashFlowPerTanggal from "@/components/card/CashflowPertanggal";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import { generateGeneralLedgerExcel } from "@/components/excel/generalLedgerExcel";
import { generateCashflowExcel } from "@/components/excel/printCashflowExcel";
import GenosPanel from "@/components/panel/GenosPanel";
import GenosTable from "@/components/table/GenosTable";
import OutletTabs from "@/components/tabs/OutletTab";
import { getCashflow, getGeneralLedger } from "@/lib/api/cashFlowApi";
import { formatRupiah } from "@/lib/helper";
import {
  AtSymbolIcon,
  CurrencyDollarIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  outlet_id: string;
  year?: string;
  month?: string;
}
interface Income {
  cash: number;
  digital: number;
  total: number;
}

interface DataGeneralLedger {
  date: string;
  income: Income;
  purchase: number;
}

export default function GeneralLedger(Props) {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );

  const [generalLedgerData, setGeneralLedgerData] = useState<
    DataGeneralLedger[]
  >([]);
  const [loading, setLoading] = useState(true);

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const TABLE_HEAD = [
    { key: "date", label: "DATE", sortable: false },
    { key: "income.cash", label: "CASH", type: "currency", sortable: false },
    {
      key: "income.digital",
      label: "DIGITAL",
      type: "currency",
      sortable: false,
    },
    { key: "income.total", label: "TOTAL", type: "currency", sortable: false },
    { key: "purchase", label: "PURCHASE", type: "currency", sortable: false },
  ];

  const TABLE_ROWS = useMemo(() => {
    return generalLedgerData.map((gl) => ({
      date: gl.date, // ambil tanggal parent
      income: gl.income,
      purchase: gl.purchase,
    }));
  }, [generalLedgerData]);

  // Cuma contoh, tidak wajib
  useEffect(() => {
    let ignore = false;

    const fetchCashflow = async () => {
      setLoading(true);
      try {
        const response = await getGeneralLedger({
          outlet_id: selectedOutletId,
          year: selectedYear.toString(),
          month: selectedMonth.toString(),
        });

        if (!ignore) {
          const items = response?.data ?? [];
          setGeneralLedgerData(items);
          console.log(items);
        }
      } catch (error) {
        console.error("Gagal memuat data cashflow:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (selectedOutletId) fetchCashflow();

    return () => {
      ignore = true; // cegah update state kalau effect cleanup dipanggil
    };
  }, [selectedOutletId, selectedYear, selectedMonth]);

  return (
    <div>
      <OutletTabs
        onSelect={setSelectedOutletId}
        onSelectName={setSelectedOutletName}
      />

      <GenosPanel
        title="CashFlow"
        subtitle="Data Cashflow Outlet per periode"
        className="mt-3"
        actionChildren={
          <div className="flex flex-wrap items-end gap-4 me-5">
            <div>
              <label className="block text-sm font-medium">Tahun</label>
              <YearDropdown value={selectedYear} onChange={setSelectedYear} />
            </div>
            <div>
              <label className="block text-sm font-medium">Bulan</label>
              <MonthDropdown
                value={selectedMonth}
                onChange={setSelectedMonth}
              />
            </div>
            <p className="text-gray-300">|</p>
            <GenosButton
              label="Cetak Excel"
              color="secondary"
              iconLeft={<PrinterIcon className="w-4 h-4" />}
              round="sm"
              onClick={() =>
                generateGeneralLedgerExcel(
                  TABLE_ROWS,
                  "generalLedger-report.xlsx",
                  selectedOutletName || "Unknown Outlet"
                )
              }
            />
          </div>
        }
      >
        {loading ? (
          <div>Memuat data...</div>
        ) : generalLedgerData.length === 0 ? (
          <div>Tidak ada data.</div>
        ) : (
          <>
            <GenosTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS} />
          </>
        )}
      </GenosPanel>
    </div>
  );
}
