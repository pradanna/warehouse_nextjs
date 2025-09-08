"use client";
import {
  DocumentChartBarIcon,
  FolderIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const tabs = [
  {
    name: "Cashflow",
    href: "/admin/finance-report/cashflow",
    icon: FolderIcon,
  },
  {
    name: "Cashflow Summary",
    href: "/admin/finance-report/cashflow-summary",
    icon: DocumentChartBarIcon,
  },
  {
    name: "General Ledger",
    href: "/admin/finance-report/general-ledger",
    icon: PresentationChartBarIcon,
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
      <div className="flex gap-4   mb-5 border-b border-b-gray-300 pb-2">
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
