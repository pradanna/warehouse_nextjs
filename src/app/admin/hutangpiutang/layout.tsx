"use client";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  HandRaisedIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const tabs = [
  {
    name: "Hutang",
    href: "/admin/hutangpiutang/hutang",
    icon: ReceiptRefundIcon,
  },
  {
    name: "Piutang",
    href: "/admin/hutangpiutang/piutang",
    icon: CurrencyDollarIcon,
  },
];

export default function HutangPiutangTabs({
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
      <div className="flex gap-4  p-2 rounded-xl">
        {tabs.map((tab) => {
          const isActive = active === tab.href;
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.href)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3 rounded-md transition-all font-semibold",
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
      <div className="p-6 bg-light1 flex-1">{children}</div>
    </div>
  );
}
