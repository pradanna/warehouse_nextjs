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
import AuthGuard from "@/components/AuthGuard";

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const menuItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "Unit",
      href: "/admin/unit",
      icon: <FolderIcon className="h-5 w-5" />,
    },
    {
      name: "Category",
      href: "/admin/category",
      icon: <ArchiveBoxIcon className="h-5 w-5" />,
    },
    {
      name: "Item",
      href: "/admin/item",
      icon: <ShoppingBagIcon className="h-5 w-5" />,
    },
    {
      name: "Outlet",
      href: "/admin/outlet",
      icon: <UserGroupIcon className="h-5 w-5" />,
    },
    {
      name: "Supplier",
      href: "/admin/supplier",
      icon: <BanknotesIcon className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: <DocumentIcon className="h-5 w-5" />,
    },
    {
      name: "purchases",
      href: "/admin/purchases",
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
    {
      name: "sales",
      href: "/admin/sales",
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
  ];

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const currentPage = getCurrentPageName(menuItems, pathname) ?? "Page";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthGuard>
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
              onLogout={handleLogout}
            />
            {/* Nested Page Content */}
            <div className="p-6 bg-light1 flex-1">{children}</div>
          </div>
        </div>
      </QueryClientProvider>
    </AuthGuard>
  );
}
