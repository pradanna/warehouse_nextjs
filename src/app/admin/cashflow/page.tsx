"use client";

import CashFlowPerTanggal from "@/components/card/CashflowPertanggal";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import GenosPanel from "@/components/panel/GenosPanel";
import OutletTabs from "@/components/tabs/OutletTab";
import { getCashflow } from "@/lib/api/cashFlowApi";
import { formatRupiah } from "@/lib/helper";
import React, { useEffect, useState } from "react";

interface Props {
  outlet_id: string;
  year?: string;
  month?: string;
}
interface CashflowItem {
  id: string;
  date: string;
  type: "debit" | "credit";
  name: string;
  amount: number;
}

export default function Cashflow({ outlet_id, year, month }: Props) {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );

  const [cashflowData, setCashflowData] = useState<CashflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    const fetchCashflow = async () => {
      try {
        const response = await getCashflow({
          outlet_id: selectedOutletId,
          year: selectedYear.toString(),
          month: selectedMonth.toString(),
        });
        const items = response?.data ?? [];

        setCashflowData(items);

        // Hitung total debit dan credit
        let debit = 0;
        let credit = 0;

        items.forEach((item: any) => {
          if (item.type === "debit") {
            debit += item.amount;
          } else if (item.type === "credit") {
            credit += item.amount;
          }
        });

        setTotalDebit(debit);
        setTotalCredit(credit);
      } catch (error) {
        console.error("Gagal memuat data cashflow:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashflow();
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
          <div className="flex flex-wrap items-center gap-4 me-5">
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
          </div>
        }
      >
        {loading ? (
          <div>Memuat data...</div>
        ) : cashflowData.length === 0 ? (
          <div>Tidak ada data.</div>
        ) : (
          <>
            <CashFlowPerTanggal data={cashflowData} />

            <div className="mt-6  pt-4 text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-green-600">Total Debit</span>
                <span>{formatRupiah(totalDebit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-red-600">Total Credit</span>
                <span>{formatRupiah(totalCredit)}</span>
              </div>

              <div className="flex justify-between mt-3 font-bold">
                <span>Total Bersih</span>
                <span>{formatRupiah(totalDebit - totalCredit)}</span>
              </div>
            </div>
          </>
        )}
      </GenosPanel>
    </div>
  );
}
