"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "@/components/dropdown-button/NotificationDropdown";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/sidebar/Sidebar";
import {
  BellIcon,
  ChartPieIcon,
  ArchiveBoxIcon,
  FolderIcon,
  ArrowsRightLeftIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  DocumentIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  XMarkIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import ProfileDropdown from "@/components/dropdown-button/ProfileDropdown";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "next/router";
import NavbarAdmin from "@/components/navbar/NavbarAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getCurrentPageName = (
    items: SidebarItem[],
    pathname: string
  ): string | null => {
    for (const item of items) {
      if (item.href && item.href === pathname) {
        return item.name;
      }
      if (item.children) {
        const childMatch = item.children.find(
          (child) => child.href === pathname
        );
        if (childMatch) return childMatch.name;
      }
    }
    return null;
  };

  const menuItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "asdas",
      href: "/admin/a",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "fa wawda",
      href: "/admin/b",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "dasdwrerer",
      href: "/admin/c",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      icon: <ArrowsRightLeftIcon className="h-5 w-5" />,
      children: [
        {
          name: "Sales",
          href: "/admin/transactions/sales",
          icon: <ChartPieIcon className="h-5 w-5" />,
        },
        {
          name: "Purchases",
          href: "/admin/transactions/purchases",
          icon: <ChartPieIcon className="h-5 w-5" />,
        },
      ],
      href: "",
    },
    // ...lanjutkan sesuai struktur
  ];

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const currentPage = getCurrentPageName(menuItems, pathname) ?? "Page";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        {/* Sidebar */}

        <Sidebar
          menuItems={menuItems}
          isSidebarOpen={isSidebarOpen}
          logoExtended="/images/local/extend-genossys-logo.png"
          logoSimple="/images/local/simple-genossys-logo.png"
          path_active={pathname}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <NavbarAdmin
            isSidebarOpen={isSidebarOpen}
            currentPage={currentPage}
            profileName="Pradana"
            profileImage="https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"
            onToggleSidebar={toggleSidebar}
          />
          {/* Nested Page Content */}
          <div className="p-6 bg-light1 flex-1">{children}</div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
