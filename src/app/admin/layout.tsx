"use client";
import { useState } from "react";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/sidebar/Sidebar";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChartPieIcon,
  FolderIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  PresentationChartBarIcon,
  ShoppingCartIcon,
  AdjustmentsHorizontalIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavbarAdmin from "@/components/navbar/NavbarAdmin";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      name: "Master Data",
      href: "/admin/master-data",
      icon: <FolderIcon className="h-5 w-5" />,
    },

    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
    },
    {
      name: "Purchases",
      href: "/admin/purchases",
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
    {
      name: "Sales",
      href: "/admin/sales",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
    },
    {
      name: "Hutang Piutang",
      href: "/admin/hutangpiutang",
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
    },
    {
      name: "Penyesuaian",
      href: "/admin/inventory-adjustment",
      icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
    },
    {
      name: "Laporan",
      href: "/admin/report",
      icon: <ChartBarSquareIcon className="h-5 w-5" />,
    },
  ];

  const financeItems: SidebarItem[] = [
    {
      name: "Kategori Pengeluaran",
      href: "/admin/expense-category",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      name: "Cash Flow",
      href: "/admin/cashflow",
      icon: <FolderIcon className="h-5 w-5" />,
    },

    {
      name: "Pemasukan Outlet",
      href: "/admin/outlet-income",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
    },
    {
      name: "Pengeluaran Outlet",
      href: "/admin/outlet-expense",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
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
            financeItems={financeItems}
            isSidebarOpen={isSidebarOpen}
            logoExtended="/images/local/logo_panjang.png"
            logoSimple="/images/local/logo_pendek.png"
            path_active={pathname}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <NavbarAdmin
              isSidebarOpen={isSidebarOpen}
              currentPage={currentPage}
              profileName="admin"
              profileImage="/images/local/avatar.png"
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
