"use client";

import GenosButton from "@/components/button/GenosButton";
// import CashFlowPerTanggal from "@/components/card/CashflowPertanggal";
import MonthDropdown from "@/components/dropdown-button/MonthDropDown";
import YearDropdown from "@/components/dropdown-button/YearDropDown";
import { generateCashflowExcel } from "@/components/excel/printCashflowExcel";
import GenosPanel from "@/components/panel/GenosPanel";
import GenosTable from "@/components/table/GenosTable";
import OutletTabs from "@/components/tabs/OutletTab";
import { getCashflow } from "@/lib/api/cashFlowApi";
import { formatRupiah } from "@/lib/helper";
import {
  AtSymbolIcon,
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  outlet_id: string;
  year?: string;
  month?: string;
}
interface CashflowItem {
  id: string;
  date: string;
  item: string;
  debit: number;
  credit: number;
  description: string;
  balance: number;
}

interface CashfflowData {
  date: string;
  data: CashflowItem[];
}

export default function Cashflow(Props) {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );

  const [cashflowData, setCashflowData] = useState<CashfflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  // FILTER
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [isCash, setIscash] = useState(true);

  const TABLE_HEAD = [
    { key: "date", label: "DATE", sortable: false },
    { key: "item", label: "Item", type: "text", sortable: false },
    { key: "debit", label: "DEBET", type: "currency", sortable: false },
    { key: "credit", label: "KREDIT", type: "currency", sortable: false },
    { key: "description", label: "DETAIL", type: "text", sortable: false },
    { key: "balance", label: "BALANCE", type: "currency", sortable: false },
  ];

  const TABLE_ROWS = useMemo(() => {
    return cashflowData.flatMap((cashflow) =>
      cashflow.data.map((item: CashflowItem) => ({
        id: item.id,
        date: cashflow.date, // ambil tanggal parent
        item: item.item,
        debit: item.debit,
        credit: item.credit,
        description: item.description,
        balance: item.balance,
      }))
    );
  }, [cashflowData]);

  // Cuma contoh, tidak wajib
  useEffect(() => {
    let ignore = false;

    const fetchCashflow = async () => {
      setLoading(true);
      try {
        const response = await getCashflow({
          outlet_id: selectedOutletId,
          year: selectedYear.toString(),
          month: selectedMonth.toString(),
          iscash: isCash,
        });

        if (!ignore) {
          const items = response?.data ?? [];
          setCashflowData(items);

          let debit = 0;
          let credit = 0;

          items.forEach((item: any) => {
            item.data.forEach((i: any) => {
              debit += i.debit;
              credit += i.credit;
            });
          });

          setTotalDebit(debit);
          setTotalCredit(credit);
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
  }, [selectedOutletId, selectedYear, selectedMonth, isCash]);

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
            <GenosButton
              round="sm"
              label="Cash"
              outlined={!isCash}
              onClick={() => setIscash(true)}
              iconLeft={<CurrencyDollarIcon className="w-4 h-4 " />}
            />
            <GenosButton
              label="Digital"
              round="sm"
              outlined={isCash}
              onClick={() => setIscash(false)}
              iconLeft={<AtSymbolIcon className="w-4 h-4" />}
            />
            <p className="text-gray-300">|</p>
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
                generateCashflowExcel(TABLE_ROWS, "cashflow-report.xlsx")
              }
            />
          </div>
        }
      >
        {loading ? (
          <div>Memuat data...</div>
        ) : cashflowData.length === 0 ? (
          <div>Tidak ada data.</div>
        ) : (
          <>
            <GenosTable
              TABLE_HEAD={TABLE_HEAD}
              TABLE_ROWS={TABLE_ROWS}
              isDanger={(row) => row.debit === 0}
              isGreat={(row) => row.credit === 0}
            />

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
