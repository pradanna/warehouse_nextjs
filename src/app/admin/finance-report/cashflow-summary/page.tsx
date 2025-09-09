"use client";

import GenosButton from "@/components/button/GenosButton";
// import CashFlowPerTanggal from "@/components/card/CashflowPertanggal";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import { generateCashflowExcel } from "@/components/excel/printCashflowExcel";
import { generateCashflowSummaryExcel } from "@/components/excel/printCashflowSummaryExcel";
import GenosPanel from "@/components/panel/GenosPanel";
import GenosTable from "@/components/table/GenosTable";
import OutletTabs from "@/components/tabs/OutletTab";
import { getCashflow, getCashflowSummary } from "@/lib/api/cashFlowApi";
import { formatRupiah } from "@/lib/helper";
import {
  AtSymbolIcon,
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { title } from "process";
import React, { useEffect, useMemo, useState } from "react";

interface Cashflow {
  title: string;
  value: number;
  type: string;
}

interface CreditData {
  material_expense: Cashflow[];
  outlet_expense: Cashflow[];
}

interface DataSummary {
  debit: Cashflow[];
  credit: CreditData;
  income: number;
  expenses: number;
  revenue: number;
}

export default function Cashflow(Props) {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );

  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [debitData, setDebitData] = useState<Cashflow[]>([]);
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const TABLE_HEAD_DEBIT = [
    { key: "no", label: "No", type: "number", sortable: false },
    { key: "title", label: "KETERANGAN", type: "text", sortable: false },
    { key: "value", label: "Nilai (Rp)", type: "currency", sortable: false },
  ];

  const TABLE_ROWS_DEBIT = useMemo(() => {
    if (!dataSummary) return [];
    return dataSummary.debit.map((cashflow, index) => ({
      no: index + 1, // ✅ nomor urut mulai dari 1
      title: cashflow.title,
      value: cashflow.value,
      type: cashflow.type,
    }));
  }, [dataSummary]);

  const TABLE_HEAD_CREDIT_MATERIAL = [
    { key: "no", label: "No", type: "number", sortable: false },
    { key: "title", label: "KETERANGAN", type: "text", sortable: false },
    {
      key: "bahanbaku",
      label: "Belanja Bahan Baku",
      type: "currency",
      sortable: false,
    },
  ];

  const TABLE_HEAD_CREDIT_OTHERS = [
    { key: "no", label: "No", type: "number", sortable: false },
    { key: "title", label: "KETERANGAN", type: "text", sortable: false },
    {
      key: "pengeluaran",
      label: "Pengeluaran Outlet",
      type: "currency",
      sortable: false,
    },
  ];

  const TABLE_ROWS_CREDIT_MATERIAL = useMemo(() => {
    if (!dataSummary) return [];

    const material = dataSummary.credit.material_expense.map(
      (cashflow, index) => ({
        no: index + 1,
        title: cashflow.title,
        bahanbaku: cashflow.value,
        type: cashflow.type,
      })
    );

    return material;
  }, [dataSummary]);

  const TABLE_ROWS_CREDIT_OTHERS = useMemo(() => {
    if (!dataSummary) return [];
    const outlet = dataSummary.credit.outlet_expense.map((cashflow, index) => ({
      no: length + index + 1, // lanjut nomor setelah material
      title: cashflow.title,
      pengeluaran: cashflow.value,
      type: cashflow.type,
    }));

    return outlet;
  }, [dataSummary]);

  useEffect(() => {
    let ignore = false;

    const fetchCashflow = async () => {
      setLoading(true);
      try {
        const response = await getCashflowSummary({
          outlet_id: selectedOutletId,
          year: selectedYear.toString(),
          month: selectedMonth.toString(),
        });

        if (!ignore) {
          const items = response?.data ?? [];
          setDataSummary(items);
          setDebitData(items.debit);
          setCreditData(items.credit);

          console.log("DEBIT :" + items.debit);
          console.log("CREDIT :" + items.credit);
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
                generateCashflowSummaryExcel(
                  TABLE_ROWS_DEBIT,
                  TABLE_ROWS_CREDIT_MATERIAL,
                  TABLE_ROWS_CREDIT_OTHERS,
                  {
                    income: dataSummary?.income || 0,
                    expenses: dataSummary?.expenses || 0,
                    revenue: dataSummary?.revenue || 0,
                  },
                  `cashflow-${selectedOutletName || "report"}.xlsx`,
                  selectedOutletName || "Unknown Outlet"
                )
              }
            />
          </div>
        }
      >
        {loading ? (
          <div>Memuat data...</div>
        ) : debitData.length === 0 ? (
          <div>Tidak ada data.</div>
        ) : (
          <>
            <div className="mb-5">
              <span className="text-center bg-green-300 text-green-950 px-2 rounded-t-xl ">
                Pendapatan
              </span>
              <div className="border border-green-300  ">
                <GenosTable
                  TABLE_HEAD={TABLE_HEAD_DEBIT}
                  TABLE_ROWS={TABLE_ROWS_DEBIT}
                  isGreat={(row) => row.type === "main"}
                  isBold={(row) => row.type === "main"}
                  key={"debit"}
                  customMinheight="0"
                />
              </div>
            </div>
            <div className="mb-5">
              <span className="text-center bg-red-300 text-red-950   px-2 rounded-t-xl ">
                Pengeluaran Bahan Baku
              </span>
              <div className="border border-red-300  ">
                <GenosTable
                  TABLE_HEAD={TABLE_HEAD_CREDIT_MATERIAL}
                  TABLE_ROWS={TABLE_ROWS_CREDIT_MATERIAL}
                  isDanger={(row) => row.type === "main"}
                  isBold={(row) => row.type === "main"}
                  key={"credit"}
                  customMinheight="0"
                />
              </div>
            </div>

            <div>
              <span className="text-center bg-red-300 text-red-950    px-2 rounded-t-xl ">
                Pengeluaran Lainya
              </span>
              <div className="border border-red-300  ">
                <GenosTable
                  TABLE_HEAD={TABLE_HEAD_CREDIT_OTHERS}
                  TABLE_ROWS={TABLE_ROWS_CREDIT_OTHERS}
                  isDanger={(row) => row.type === "main"}
                  isBold={(row) => row.type === "main"}
                  key={"credit"}
                />
              </div>
            </div>
            <div className="mt-6  pt-4 text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-green-600">
                  Total Pemasukan
                </span>
                <span>{formatRupiah(dataSummary?.income ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-red-600">
                  Total Pengeluaran
                </span>
                <span>{formatRupiah(dataSummary?.expenses ?? 0)}</span>
              </div>

              <div className="flex justify-between mt-3 font-bold">
                <span>Total Pendapatan Bersih</span>
                <span>{formatRupiah(dataSummary?.revenue ?? 0)}</span>
              </div>
            </div>
          </>
        )}
      </GenosPanel>
    </div>
  );
}
