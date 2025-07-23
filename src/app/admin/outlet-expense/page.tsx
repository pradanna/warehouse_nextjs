"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function OutletExpense() {
  return (
    <GenosPanel
      title="Pengeluaran Outlet"
      subtitle="Halaman sedang dalam pengembangan"
      className="mt-3"
    >
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WrenchScrewdriverIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Halaman Dalam Pengembangan
        </h2>
        <p className="text-gray-500">
          Kami sedang menyiapkan fitur terbaik untukmu. Mohon tunggu ya!
        </p>
      </div>
    </GenosPanel>
  );
}
