"use client";

import { formatRupiah } from "@/lib/helper";
import React from "react";

interface CashflowItem {
  id: string;
  date: string;
  type: "debit" | "credit";
  name: string;
  amount: number;
}

interface CashflowOutlet {
  data: CashflowItem[];
}

const groupByDate = (items: CashflowItem[]) => {
  return items.reduce((acc: Record<string, CashflowItem[]>, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});
};

export default function CashFlowPerTanggal({ data }: CashflowOutlet) {
  const grouped = groupByDate(data);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, items]) => {
        const totalIncome = items
          .filter((item) => item.type === "debit")
          .reduce((sum, curr) => sum + curr.amount, 0);

        const totalExpense = items
          .filter((item) => item.type === "credit")
          .reduce((sum, curr) => sum + curr.amount, 0);

        const netTotal = totalIncome - totalExpense;

        return (
          <div key={date} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {new Date(date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div
                className={`text-sm font-bold ${
                  netTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Total: {formatRupiah(netTotal)}
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-md flex justify-between text-xs ${
                    item.type === "debit"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span>{item.name}</span>
                  <span>{formatRupiah(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
