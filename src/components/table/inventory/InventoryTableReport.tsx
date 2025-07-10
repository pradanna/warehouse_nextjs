import { useEffect, useMemo, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import { getInventory } from "@/lib/api/inventoryApi";
import { getItems } from "@/lib/api/itemApi";
import { getUnit } from "@/lib/api/unitApi";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { generateCurrentStockPDF } from "@/components/PDF/printCurrentStock";
import { generateCurrentStockExcel } from "@/components/excel/printCurrentStockExcel";

const InventoryTableReport = () => {
  // Contoh data option untuk filter (bisa dari API)

  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  const [items, setItems] = useState([
    { id: "item-1", name: "Item A" },
    { id: "item-2", name: "Item B" },
  ]);
  const [units, setUnits] = useState([
    { id: "unit-1", name: "PCS" },
    { id: "unit-2", name: "BOX" },
  ]);

  // Filter States
  const [itemId, setItemId] = useState<string | number | null>("");
  const [unitId, setUnitId] = useState<string | number | null>("");
  const [param, setparam] = useState("");

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "item.name", label: "Name", sortable: true },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "current_stock", label: "Stok", sortable: false },
      { key: "unit.name", label: "Unit", sortable: false },
    ],
    []
  );

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await getInventory(param, currentPage, 10);
      console.log(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  const fetchItems = async () => {
    try {
      const res = await getItems("", 1, 1000);
      setItems(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data item");
    }
  };

  const fetchUnit = async () => {
    try {
      const res = await getUnit("", 1, 1000);
      setUnits(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data item");
    }
  };

  const handleDownloadPDF = () => {
    generateCurrentStockPDF(TABLE_ROWS);
  };

  const handleDownloadExcel = () => {
    generateCurrentStockExcel(TABLE_ROWS);
  };

  useEffect(() => {
    fetchUnit();
    fetchItems();
    fetchInventory();
  }, [itemId, unitId, param]);

  return (
    <>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={isLoadingTable}
        isBelowStock={(row) => row.current_stock < row.min_stock}
        isAboveStock={(row) => row.current_stock > row.max_stock}
        FILTER={
          <div className="flex gap-4 mb-4 items-end w-full">
            <GenosTextfield
              id="search"
              label="Pencarian"
              placeholder="Masukan barang yang kamu cari"
              className="w-64 text-xs"
              value={param}
              onChange={(e) => setparam(e.target.value)}
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
    </>
  );
};

export default InventoryTableReport;
