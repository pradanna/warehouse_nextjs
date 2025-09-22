"use client";
import { BanknotesIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import GenosPanel from "@/components/panel/GenosPanel";
import CardDashboard from "@/components/card/CardDashboard";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import HutangTable from "@/components/table/dashboard/hutangTable";
import PiutangTable from "@/components/table/dashboard/piutangTable";

export default function DashboardPage() {
  return (
    <div>
      {/* <div className="flex flex-row gap-4">
        <CardDashboard
          title="Data Inventory"
          href="/admin/inventory"
          icon={<ArchiveBoxIcon className="h-5 w-5 text-gray-500" />}
          items={[
            {
              value: 50,
              unit: "item",
              label: "Tersedia",
              color: "text-blue-500",
            },
            {
              value: 10,
              unit: "item",
              label: "Akan Habis",
              color: "text-red-500",
            },
            {
              value: 5,
              unit: "item",
              label: "Stock Lebih",
              color: "text-orange-400",
            },
          ]}
        />

        <CardDashboard
          title="Data Purchase"
          icon={<ShoppingCartIcon className="h-5 w-5 text-gray-500" />}
          href="/admin/purchases"
          items={[
            {
              value: 120,
              unit: "transaksi",
              label: "Bulan Ini",
              color: "text-green-500",
            },
            {
              value: 98,
              unit: "transaksi",
              label: "Bulan Lalu",
              color: "text-gray-500",
            },
          ]}
        />

        <CardDashboard
          title="Data Sales"
          icon={<BanknotesIcon className="h-5 w-5 text-gray-500" />}
          href="/admin/sales"
          items={[
            {
              value: 210,
              unit: "transaksi",
              label: "Bulan Ini",
              color: "text-green-500",
            },
            {
              value: 180,
              unit: "transaksi",
              label: "Bulan Lalu",
              color: "text-gray-500",
            },
          ]}
        />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <GenosPanel
          title="Data Hutang yang belum lunas"
          subtitle="Daftar seluruh transaksi hutang supplier"
        >
          <HutangTable />
        </GenosPanel>

        <GenosPanel
          title="Data Piutang yang belum lunas"
          subtitle="Daftar seluruh transaksi piutang pelanggan"
        >
          <PiutangTable />
        </GenosPanel>
      </div>
    </div>
  );
}
