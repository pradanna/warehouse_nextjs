"use client";
import {
  ArchiveBoxIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ReceiptRefundIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const tabs = [
  {
    name: "Stok Saat Ini",
    href: "/admin/report/current-stock",
    icon: ArchiveBoxIcon, // Bisa juga CubeIcon untuk alternatif
  },
  {
    name: "Perpindahan Stock",
    href: "/admin/report/stock-movement",
    icon: ShoppingBagIcon,
  },

  {
    name: "Riwayat Penyesuaian",
    href: "/admin/report/stock-adjustment-history",
    icon: ReceiptRefundIcon,
  },
  {
    name: "Laporan Pembelian",
    href: "/admin/report/purchase",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Laporan Penjualan",
    href: "/admin/report/sales",
    icon: BanknotesIcon,
  },
];

export default function ReportTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <div>
      <div className="flex gap-4  rounded-xl">
        {tabs.map((tab) => {
          const isActive = active === tab.href;
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.href)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3 rounded-md transition-all font-semibold cursor-pointer",
                isActive
                  ? "bg-primary-color text-white "
                  : "bg-white text-gray-600 hover:bg-primary/10 border border-gray-200"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className=" bg-light1 flex-1">{children}</div>
    </div>
  );
}
