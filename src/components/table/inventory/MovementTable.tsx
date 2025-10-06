import { useEffect, useMemo, useState } from "react";
import GenosTableFrontend from "../GenosTableFrontend";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { getMovements } from "@/lib/api/movementApi";
import { generateCurrentStockPDF } from "@/components/PDF/printCurrentStock";
import { generateCurrentStockExcel } from "@/components/excel/printCurrentStockExcel";
import GenosSelect from "@/components/form/GenosSelect";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import { generateMovementPDF } from "@/components/PDF/printMovementStock";
import { generateMovementExcel } from "@/components/excel/printMovementStock";
import { dateRange } from "@/lib/helper";

const MovementTableReport = () => {
  const [TABLE_ROWS_ORI, setTABLE_ROWS_ORI] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  // pagination frontend
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // filter state
  const [type, setType] = useState("");
  const [movementType, setMovementType] = useState("");
  const [itemName, setItemName] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(dateRange.todayStart);
  const [dateTo, setDateTo] = useState<Date | null>(dateRange.todayEnd);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "type", label: "Type", sortable: true },
      { key: "quantity_open", label: "Quantity Open", sortable: false },
      { key: "quantity", label: "Quantity", sortable: false },
      { key: "quantity_close", label: "Quantity Close", sortable: false },
      { key: "movement_type", label: "Movement Type", sortable: true },
      { key: "item.name", label: "Nama Item", sortable: true },
      { key: "unit.name", label: "Satuan", sortable: true },
      { key: "author.username", label: "Author", sortable: true },
      { key: "created_at", label: "Tanggal", sortable: true },
    ],
    []
  );

  // filter frontend
  const TABLE_ROWS = useMemo(() => {
    return TABLE_ROWS_ORI.filter((row) => {
      let pass = true;

      if (type && row.type !== type) pass = false;
      if (movementType && row.movement_type !== movementType) pass = false;
      if (
        itemName &&
        !row.item?.name?.toLowerCase().includes(itemName.toLowerCase())
      )
        pass = false;

      if (dateFrom) {
        const created = new Date(row.created_at);
        if (created < dateFrom) pass = false;
      }
      if (dateTo) {
        const created = new Date(row.created_at);
        if (created > dateTo) pass = false;
      }

      return pass;
    });
  }, [TABLE_ROWS_ORI, type, movementType, itemName, dateFrom, dateTo]);

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await getMovements(1, 1000000000); // ambil semua data
      setTABLE_ROWS_ORI(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  const handleDownloadPDF = () => {
    generateMovementPDF(TABLE_ROWS, {
      type: type,
      movement_type: movementType,
      item_name: itemName,
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  const handleDownloadExcel = () => {
    generateMovementExcel(TABLE_ROWS, {
      type: type, // misal "in" / "out"
      movement_type: movementType, // misal "purchase" / "sale" / "adjustment"
      item_name: itemName, // dari filter nama item
      date_from: dateFrom, // Date | null
      date_to: dateTo, // Date | null
    });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <GenosTableFrontend
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        loading={isLoadingTable}
        SORT
        FILTER={
          <div className="flex flex-wrap gap-4 mb-4 items-end w-full">
            <GenosSelect
              label="Type"
              options={[
                { label: "All", value: "" },
                { label: "In", value: "in" },
                { label: "Out", value: "out" },
              ]}
              value={type}
              onChange={(e: any) => setType(e.target.value)}
            />

            <GenosSelect
              label="Movement Type"
              options={[
                { label: "All", value: "" },
                { label: "Purchase", value: "purchase" },
                { label: "Sale", value: "sale" },
                { label: "Adjustment", value: "adjustment" },
              ]}
              value={movementType}
              onChange={(e: any) => setMovementType(e.target.value)}
            />

            <GenosTextfield
              id="filter-item"
              label="Nama Item"
              value={itemName}
              onChange={(e: any) => setItemName(e.target.value)}
            />

            <GenosDatepicker
              id="tanggal-dari"
              label="Dari Tanggal"
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
            />

            <GenosDatepicker
              id="tanggal-sampai"
              label="Sampai Tanggal"
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
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

export default MovementTableReport;
