import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PrinterIcon } from "@heroicons/react/24/outline";

import GenosTableFrontend from "../GenosTableFrontend";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";
import GenosDropdown from "@/components/button/GenosDropdown";

import { getInventory } from "@/lib/api/inventory/inventoryApi";
import { generateCurrentStockPDF } from "@/components/PDF/printCurrentStock";
import { generateCurrentStockExcel } from "@/components/excel/printCurrentStockExcel";

const InventoryTableReport = () => {
  const [TABLE_ROWS, setTABLE_ROWS] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  // Filter States
  const [sku, setSku] = useState("");
  const [itemName, setItemName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [dangerOnly, setDangerOnly] = useState(false);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "item.name", label: "Name", sortable: true },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "current_stock", label: "Stok", sortable: true },
      { key: "unit.name", label: "Unit", sortable: true },
    ],
    []
  );

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      // Ambil semua data
      const res = await getInventory("", currentPage, 100000000000);
      let rows = res.data;

      // filter frontend
      if (sku) {
        rows = rows.filter((r: any) =>
          r.sku?.toLowerCase().includes(sku.toLowerCase())
        );
      }
      if (itemName) {
        rows = rows.filter((r: any) =>
          r.item?.name?.toLowerCase().includes(itemName.toLowerCase())
        );
      }
      if (unitName) {
        rows = rows.filter((r: any) =>
          r.unit?.name?.toLowerCase().includes(unitName.toLowerCase())
        );
      }
      if (dangerOnly) {
        rows = rows.filter((r: any) => r.current_stock < r.min_stock);
      }

      setTABLE_ROWS(rows);
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  const handleDownloadPDF = () => {
    generateCurrentStockPDF(TABLE_ROWS, {
      sku,
      itemName,
      unitName,
      dangerOnly,
    });
  };

  const handleDownloadExcel = () => {
    generateCurrentStockExcel(TABLE_ROWS, {
      sku,
      itemName,
      unitName,
      dangerOnly,
    });
  };

  useEffect(() => {
    fetchInventory();
  }, [sku, itemName, unitName, dangerOnly, currentPage]);

  return (
    <GenosTableFrontend
      TABLE_HEAD={TABLE_HEAD}
      TABLE_ROWS={TABLE_ROWS}
      PAGINATION
      SORT
      rowsPerPage={limit}
      loading={isLoadingTable}
      isDanger={(row) => row.current_stock < row.min_stock}
      isGreat={(row) => row.current_stock > row.max_stock}
      FILTER={
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <GenosTextfield
            id="search-sku"
            label="SKU"
            placeholder="Cari SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-48"
          />

          <GenosTextfield
            id="search-item"
            label="Item Name"
            placeholder="Cari Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-64"
          />

          <GenosTextfield
            id="search-unit"
            label="Unit Name"
            placeholder="Cari Unit"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            className="w-48"
          />

          <GenosSearchSelect
            label="Filter Stok"
            options={[{ value: "danger", label: "Stok Mau Habis" }]}
            value={dangerOnly ? "danger" : "all"}
            onChange={(val: any) => setDangerOnly(val === "danger")}
            className="w-48"
          />
        </div>
      }
      RIGHT_DIV={
        <GenosDropdown
          iconLeft={<PrinterIcon className="w-5 h-5" />}
          round="md"
          color="gray"
          outlined
          align="right"
          options={[
            {
              label: "Download PDF",
              icon: <i className="fa-regular fa-file-pdf text-red-500" />,
              onClick: handleDownloadPDF,
            },
            {
              label: "Download Excel",
              icon: <i className="fa-regular fa-file-excel text-green-500" />,
              onClick: handleDownloadExcel,
            },
          ]}
        />
      }
    />
  );
};

export default InventoryTableReport;
