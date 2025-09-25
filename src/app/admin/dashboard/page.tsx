"use client";
import { BanknotesIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import GenosPanel from "@/components/panel/GenosPanel";
import CardDashboard from "@/components/card/CardDashboard";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import HutangTable from "@/components/table/dashboard/hutangTable";
import PiutangTable from "@/components/table/dashboard/piutangTable";
import { useEffect, useState } from "react";
import { getInventory } from "@/lib/api/inventory/inventoryApi";
import { getPurchases } from "@/lib/api/purchaseApi";
import { dateRange } from "@/lib/helper";
import { getSales } from "@/lib/api/saleApi";

export default function DashboardPage() {
  const [itemTersedia, setItemTersedia] = useState(0);
  const [itemAkanHabis, setItemAkanHabis] = useState(0);
  const [itemStockLebih, setItemStockLebih] = useState(0);

  const [transaksiBulanIni, setTransaksiBulanIni] = useState(0);
  const [transaksiBulanLalu, setTransaksiBulanLalu] = useState(0);

  const [dataSalesBulanIni, setDataSalesBulanIni] = useState(0);
  const [dataSalesBulanLalu, setDataSalesBulanLalu] = useState(0);

  const awalBulanIni = dateRange.monthStart;
  const akhirBulanIni = dateRange.monthEnd;

  const awalBulanLalu = dateRange.lastMonthStart;
  const akhirBulanLalu = dateRange.lastMonthEnd;

  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  const fetchInventoryData = async () => {
    setLoadingInventory(true);
    try {
      const response = await getInventory("", 1, 1000000000000000000);

      setItemTersedia(response.meta.total_rows);
      // Hitung item yang hampir habis (current_stock < min_stock)
      const akanHabis = response.data.filter(
        (item: any) => item.current_stock < item.min_stock
      ).length;
      setItemAkanHabis(akanHabis);

      // Hitung item yang kelebihan stok (current_stock > max_stock)
      const stockLebih = response.data.filter(
        (item: any) => item.current_stock > item.max_stock
      ).length;
      setItemStockLebih(stockLebih);

      // setItemStockLebih(data.stock_lebih);

      console.log("Response Inventory:", response);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchPurchaseData = async () => {
    setLoadingPurchase(true);
    try {
      const responseBulanIni = await getPurchases(
        1,
        1000000000000000000,
        "",
        "",
        "",
        "",
        awalBulanIni,
        akhirBulanIni
      );
      const responseBulanKemaren = await getPurchases(
        1,
        1000000000000000000,
        "",
        "",
        "",
        "",
        awalBulanLalu,
        akhirBulanLalu
      );

      setTransaksiBulanIni(responseBulanIni.meta.total_rows);
      setTransaksiBulanLalu(responseBulanKemaren.meta.total_rows);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    } finally {
      setLoadingPurchase(false);
    }
  };

  const fetchSalesData = async () => {
    setLoadingSales(true);
    try {
      const responseBulanIni = await getSales(
        1,
        1000000000000000000,
        "",
        "",
        "",
        "",
        awalBulanIni,
        akhirBulanIni
      );
      const responseBulanKemaren = await getSales(
        1,
        1000000000000000000,
        "",
        "",
        "",
        "",
        awalBulanLalu,
        akhirBulanLalu
      );

      setDataSalesBulanIni(responseBulanIni.meta.total_rows);
      setDataSalesBulanLalu(responseBulanKemaren.meta.total_rows);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchPurchaseData();
    fetchSalesData();
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-4">
        <CardDashboard
          title="Data Inventory"
          href="/admin/inventory"
          loading={loadingInventory}
          icon={<ArchiveBoxIcon className="h-5 w-5 text-gray-500" />}
          items={[
            {
              value: itemTersedia,
              unit: "item",
              label: "Tersedia",
              color: "text-blue-500",
            },
            {
              value: itemAkanHabis,
              unit: "item",
              label: "Akan Habis",
              color: "text-red-500",
            },
            {
              value: itemStockLebih,
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
          loading={loadingPurchase}
          items={[
            {
              value: transaksiBulanIni,
              unit: "transaksi",
              label: "Bulan Ini",
              color: "text-green-500",
            },
            {
              value: transaksiBulanLalu,
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
          loading={loadingSales}
          items={[
            {
              value: dataSalesBulanIni,
              unit: "transaksi",
              label: "Bulan Ini",
              color: "text-green-500",
            },
            {
              value: dataSalesBulanLalu,
              unit: "transaksi",
              label: "Bulan Lalu",
              color: "text-gray-500",
            },
          ]}
        />
      </div>

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
