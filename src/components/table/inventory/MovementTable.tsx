import { useEffect, useMemo, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import { toast } from "react-toastify";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { generateCurrentStockPDF } from "@/components/PDF/printCurrentStock";
import { generateCurrentStockExcel } from "@/components/excel/printCurrentStockExcel";
import { getMovements } from "@/lib/api/movementApi";

const MovementTableReport = () => {
  // Contoh data option untuk filter (bisa dari API)

  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
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

  const [addItemId, setAddItemId] = useState<string | number>("");
  const [addUnitId, setAddUnitId] = useState<string | number>("");
  const [addSku, setAddSku] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPrice, setAddPrice] = useState(0);
  const [addCurrentStock, setAddCurrentStock] = useState(0);
  const [addMinStock, setAddMinStock] = useState(0);
  const [addMaxStock, setAddMaxStock] = useState(0);
  const [outletPrices, setOutletPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [outlets, setOutlets] = useState<any[]>([]);

  const [editId, setEditId] = useState("");
  const [editItemId, setEditItemId] = useState<string | number>("");
  const [editUnitId, setEditUnitId] = useState<string | number>("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCurrentStock, setEditCurrentStock] = useState(0);
  const [editMinStock, setEditMinStock] = useState(0);
  const [editMaxStock, setEditMaxStock] = useState(0);
  const [editOutletPrices, setEditOutletPrices] = useState<{
    [key: string]: number;
  }>({});

  const TABLE_HEAD = useMemo(
    () => [
      { key: "type", label: "type", sortable: true },
      { key: "quantity_open", label: "quantity_open", sortable: true },
      { key: "quantity", label: "quantity", sortable: false },
      { key: "quantity_close", label: "quantity_close", sortable: false },
      { key: "movement_type", label: "movement_type", sortable: false },
      { key: "item.name", label: "Nama Item", sortable: false },
      { key: "unit.name", label: "Satuan", sortable: false },
      { key: "author.username", label: "Author", sortable: false },
    ],
    []
  );

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await getMovements(currentPage, 100);
      console.log(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  const handleDownloadPDF = () => {
    generateCurrentStockPDF(TABLE_ROWS);
  };

  const handleDownloadExcel = () => {
    generateCurrentStockExcel(TABLE_ROWS);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

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
        FILTER={<div className="flex gap-4 mb-4 items-end w-full"></div>}
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

export default MovementTableReport;
