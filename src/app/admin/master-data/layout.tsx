"use client";
import {
  ArchiveBoxIcon,
  BanknotesIcon,
  FolderIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const tabs = [
  {
    name: "Unit",
    href: "/admin/master-data/unit",
    icon: FolderIcon,
  },
  {
    name: "Category",
    href: "/admin/master-data/category",
    icon: ArchiveBoxIcon,
  },
  {
    name: "Item",
    href: "/admin/master-data/item",
    icon: ShoppingBagIcon,
  },
  {
    name: "Outlet",
    href: "/admin/master-data/outlet",
    icon: UserGroupIcon,
  },
  {
    name: "Supplier",
    href: "/admin/master-data/supplier",
    icon: BanknotesIcon,
  },
];

export default function MasterDataTabs({
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
      <div className="bg-light1 flex-1">{children}</div>
    </div>
  );
}
